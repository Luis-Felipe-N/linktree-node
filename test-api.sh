#!/bin/bash

# Script para testar os endpoints da API

BASE_URL="http://localhost:3333"

echo "=== Testando API Linktree ==="
echo ""

# 1. Registrar usuário
echo "1. Criando usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }')
echo "Resposta: $REGISTER_RESPONSE"
echo ""

# 2. Fazer login
echo "2. Fazendo login..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }')
echo "Resposta: $AUTH_RESPONSE"

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# 3. Verificar se usuário tem páginas
echo "3. Buscando páginas do usuário..."
PAGES_RESPONSE=$(curl -s -X GET "$BASE_URL/me/pages" \
  -H "Authorization: Bearer $TOKEN")
echo "Resposta: $PAGES_RESPONSE"
echo ""

# 4. Buscar perfil do usuário
echo "4. Buscando perfil do usuário..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer $TOKEN")
echo "Resposta: $PROFILE_RESPONSE"
echo ""

echo "=== Testes concluídos! ==="
