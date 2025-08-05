package main

import (
	"crypto/rand"
	"encoding/json"
	"html/template"
	"log"
	"math/big"
	"net/http"
	"os"
)

type PasswordConfig struct {
	Length          int  `json:"length"`
	UseUppercase    bool `json:"useUppercase"`
	UseLowercase    bool `json:"useLowercase"`
	UseNumbers      bool `json:"useNumbers"`
	UseSymbols      bool `json:"useSymbols"`
	EasyToSay       bool `json:"easyToSay"`
	EasyToRead      bool `json:"easyToRead"`
	AllCharacters   bool `json:"allCharacters"`
}

type PasswordResponse struct {
	Password string `json:"password"`
}

func generatePassword(config PasswordConfig) (string, error) {
	var charset string
	
	if config.AllCharacters {
		if config.UseUppercase {
			charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		}
		if config.UseLowercase {
			charset += "abcdefghijklmnopqrstuvwxyz"
		}
		if config.UseNumbers {
			charset += "0123456789"
		}
		if config.UseSymbols {
			charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
		}
	} else if config.EasyToSay {
		if config.UseUppercase {
			charset += "BCDFGHJKLMNPQRSTVWXYZ"
		}
		if config.UseLowercase {
			charset += "bcdfghjklmnpqrstvwxyz"
		}
		// Easy to say avoids numbers and symbols
	} else if config.EasyToRead {
		if config.UseUppercase {
			charset += "ABCDEFGHJKLMNPQRSTUVWXYZ" // Excludes I, O
		}
		if config.UseLowercase {
			charset += "abcdefghjkmnpqrstuvwxyz" // Excludes i, l, o
		}
		if config.UseNumbers {
			charset += "23456789" // Excludes 0, 1
		}
		if config.UseSymbols {
			charset += "!@#$%^&*"
		}
	}
	
	if charset == "" {
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	}
	
	password := make([]byte, config.Length)
	charsetLen := big.NewInt(int64(len(charset)))
	
	for i := 0; i < config.Length; i++ {
		n, err := rand.Int(rand.Reader, charsetLen)
		if err != nil {
			return "", err
		}
		password[i] = charset[n.Int64()]
	}
	
	return string(password), nil
}

func homePage(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	if err := tmpl.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func generateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	var config PasswordConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	password, err := generatePassword(config)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	response := PasswordResponse{Password: password}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	
	http.HandleFunc("/", homePage)
	http.HandleFunc("/generate", generateHandler)
	
	port := os.Getenv("PORT")
	if port == "" {
		port = "8090"
	}
	
	log.Printf("Server starting on :%s...\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}