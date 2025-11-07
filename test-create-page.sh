#!/bin/bash

# Script para testar criação de página

BASE_URL="http://localhost:3333"

echo "=== Teste: Criar Página ==="
echo ""

# 1. Registrar usuário
echo "1. Criando usuário..."
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "pageuser",
    "email": "pageuser@example.com",
    "password": "123456"
  }'
echo ""
echo ""

# 2. Fazer login
echo "2. Fazendo login..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "pageuser",
    "password": "123456"
  }')

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token obtido: ${TOKEN:0:20}..."
echo ""

# 3. Criar página
echo "3. Criando página..."
curl -s -X POST "$BASE_URL/pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "minha-pagina-teste",
    "title": "Minha Página de Teste",
    "description": "Uma página criada para testar a API",
    "imageUrl": "https://example.com/avatar.jpg"
  }'
echo ""
echo ""

# 4. Listar páginas do usuário
echo "4. Listando páginas do usuário..."
curl -s -X GET "$BASE_URL/me/pages" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# 5. Buscar página pelo slug
echo "5. Buscando página pelo slug..."
curl -s -X GET "$BASE_URL/p/minha-pagina-teste"
echo ""
echo ""

echo "=== Teste concluído! ==="
