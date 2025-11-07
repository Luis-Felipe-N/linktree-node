#!/bin/bash

# Teste completo de busca de páginas por slug e ID

BASE_URL="http://localhost:3333"

echo "=== Teste de Busca de Páginas ==="
echo ""

# Step 1: Registrar um usuário
echo "1. Registrando usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User Pages",
    "email": "testpages@example.com",
    "username": "testpages",
    "password": "123456"
  }')

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Step 2: Fazer login
echo "2. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testpages",
    "password": "123456"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Erro ao obter token!"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "Token obtido: ${TOKEN:0:20}..."
echo ""

# Step 3: Criar uma página
echo "3. Criando uma página..."
CREATE_PAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "minha-pagina-teste",
    "title": "Minha Página de Teste",
    "description": "Descrição da minha página",
    "imageUrl": "https://example.com/image.jpg"
  }')

echo "$CREATE_PAGE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CREATE_PAGE_RESPONSE"

PAGE_ID=$(echo "$CREATE_PAGE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['page']['id'])" 2>/dev/null)

if [ -z "$PAGE_ID" ]; then
  echo "Erro ao criar página!"
  exit 1
fi

echo ""
echo "Página criada com ID: $PAGE_ID"
echo ""

# Step 4: Buscar página por slug
echo "4. Buscando página por slug (minha-pagina-teste)..."
SLUG_RESPONSE=$(curl -s -X GET "$BASE_URL/p/minha-pagina-teste")
echo "$SLUG_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SLUG_RESPONSE"
echo ""

# Step 5: Buscar página por ID
echo "5. Buscando página por ID ($PAGE_ID)..."
ID_RESPONSE=$(curl -s -X GET "$BASE_URL/pages/$PAGE_ID")
echo "$ID_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ID_RESPONSE"
echo ""

# Step 6: Testar busca de página inexistente por slug
echo "6. Testando busca de página inexistente por slug..."
NOT_FOUND_SLUG=$(curl -s -X GET "$BASE_URL/p/pagina-inexistente")
echo "$NOT_FOUND_SLUG" | python3 -m json.tool 2>/dev/null || echo "$NOT_FOUND_SLUG"
echo ""

# Step 7: Testar busca de página inexistente por ID
echo "7. Testando busca de página inexistente por ID..."
NOT_FOUND_ID=$(curl -s -X GET "$BASE_URL/pages/123e4567-e89b-12d3-a456-426614174000")
echo "$NOT_FOUND_ID" | python3 -m json.tool 2>/dev/null || echo "$NOT_FOUND_ID"
echo ""

echo "=== Testes concluídos ==="
