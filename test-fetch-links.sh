#!/bin/bash

# Teste completo de adicionar e buscar links por página

BASE_URL="http://localhost:3333"

echo "=== Teste: Adicionar e Buscar Links ==="
echo ""

# Step 1: Registrar usuário
echo "1. Registrando usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Links User",
    "email": "testlinks@example.com",
    "username": "testlinks",
    "password": "123456"
  }')

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Step 2: Login
echo "2. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testlinks",
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

# Step 3: Criar página
echo "3. Criando uma página..."
CREATE_PAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "page-with-links",
    "title": "Página com Links",
    "description": "Teste de links"
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

# Step 4: Adicionar links
echo "4. Adicionando links à página..."

echo "   a) Link 1: GitHub"
LINK1=$(curl -s -X POST "$BASE_URL/pages/$PAGE_ID/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://github.com/usuario",
    "title": "Meu GitHub"
  }')
echo "$LINK1" | python3 -m json.tool 2>/dev/null || echo "$LINK1"
echo ""

echo "   b) Link 2: LinkedIn"
LINK2=$(curl -s -X POST "$BASE_URL/pages/$PAGE_ID/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://linkedin.com/in/usuario",
    "title": "LinkedIn",
    "thumbnailUrl": "https://cdn.example.com/linkedin.png"
  }')
echo "$LINK2" | python3 -m json.tool 2>/dev/null || echo "$LINK2"
echo ""

echo "   c) Link 3: Website"
LINK3=$(curl -s -X POST "$BASE_URL/pages/$PAGE_ID/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://meusite.com",
    "title": "Meu Site Pessoal",
    "highlightEffect": "pulse",
    "type": "link"
  }')
echo "$LINK3" | python3 -m json.tool 2>/dev/null || echo "$LINK3"
echo ""

# Step 5: Buscar links da página
echo "5. Buscando todos os links da página..."
FETCH_LINKS=$(curl -s -X GET "$BASE_URL/pages/$PAGE_ID/links")
echo "$FETCH_LINKS" | python3 -m json.tool 2>/dev/null || echo "$FETCH_LINKS"
echo ""

# Step 6: Verificar ordenação
LINK_COUNT=$(echo "$FETCH_LINKS" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['links']))" 2>/dev/null)
echo "Total de links encontrados: $LINK_COUNT"
echo ""

# Step 7: Tentar buscar links de página inexistente
echo "6. Testando busca de links em página inexistente..."
NOT_FOUND=$(curl -s -X GET "$BASE_URL/pages/123e4567-e89b-12d3-a456-426614174000/links")
echo "$NOT_FOUND" | python3 -m json.tool 2>/dev/null || echo "$NOT_FOUND"
echo ""

echo "=== Testes concluídos ==="
