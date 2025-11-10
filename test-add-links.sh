#!/bin/bash

# Script de teste para adicionar links a uma página

BASE_URL="http://localhost:3333"

echo "=== Teste: Adicionar Link a Página ==="
echo ""

# Step 1: Registrar usuário
echo "1. Registrando usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User Links",
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
    "slug": "minha-pagina-links",
    "title": "Minha Página com Links",
    "description": "Página para testar adição de links"
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

# Step 4: Adicionar primeiro link
echo "4. Adicionando primeiro link..."
ADD_LINK1_RESPONSE=$(curl -s -X POST "$BASE_URL/pages/$PAGE_ID/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://github.com",
    "title": "Meu GitHub",
    "thumbnailUrl": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
  }')

echo "$ADD_LINK1_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ADD_LINK1_RESPONSE"
echo ""

# Step 5: Adicionar segundo link
echo "5. Adicionando segundo link..."
ADD_LINK2_RESPONSE=$(curl -s -X POST "$BASE_URL/pages/$PAGE_ID/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://linkedin.com/in/example",
    "title": "LinkedIn",
    "type": "link"
  }')

echo "$ADD_LINK2_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ADD_LINK2_RESPONSE"
echo ""

# Step 6: Adicionar terceiro link com efeito
echo "6. Adicionando terceiro link com efeito..."
ADD_LINK3_RESPONSE=$(curl -s -X POST "$BASE_URL/pages/$PAGE_ID/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://twitter.com/example",
    "title": "Twitter",
    "highlightEffect": "pulse"
  }')

echo "$ADD_LINK3_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ADD_LINK3_RESPONSE"
echo ""

# Step 7: Buscar página com links
echo "7. Buscando página para ver os links..."
GET_PAGE_RESPONSE=$(curl -s -X GET "$BASE_URL/pages/minha-pagina-links")
echo "$GET_PAGE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$GET_PAGE_RESPONSE"
echo ""

# Step 8: Tentar adicionar link em página de outro usuário (deve falhar)
echo "8. Testando adicionar link em página não autorizada (deve falhar)..."
UNAUTHORIZED_RESPONSE=$(curl -s -X POST "$BASE_URL/pages/00000000-0000-0000-0000-000000000000/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://example.com",
    "title": "Link não autorizado"
  }')

echo "$UNAUTHORIZED_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$UNAUTHORIZED_RESPONSE"
echo ""

echo "=== Testes concluídos ==="
