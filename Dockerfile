# Build stage
FROM golang:1.24-alpine AS builder

# Install ca-certificates for SSL/TLS
RUN apk add --no-cache ca-certificates git

# Set working directory
WORKDIR /build

# Copy go mod files
COPY go.mod go.sum* ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
# CGO_ENABLED=0 for static binary
# -ldflags="-w -s" to strip debug info and reduce size
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o go_password main.go

# Final stage
FROM scratch

# Copy ca-certificates from builder
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the binary from builder
COPY --from=builder /build/go_password /go_password

# Copy static files and templates
COPY --from=builder /build/static /static
COPY --from=builder /build/templates /templates

# Expose port (default 8090, but can be overridden with PORT env var)
EXPOSE 8090

# Run as non-root user
USER 1000:1000

# Set the entrypoint
ENTRYPOINT ["/go_password"]
