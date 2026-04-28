# N8N Environment Manager - Documentação do Projeto

## 📋 Visão Geral

**N8N Environment Manager** é uma aplicação desktop construída com **Tauri** (com frontend em React/TypeScript) que permite gerenciar workflows do N8N em múltiplos ambientes, facilitando:

- Upload de arquivos JSON de workflows do N8N
- Gerenciamento de variáveis de ambiente para diferentes ambientes (dev, staging, prod, etc)
- Substituição automática de credenciais genéricas por credenciais específicas do ambiente
- Download de workflows customizados por ambiente
- Versionamento via GitHub para manter histórico de workflows

---

## 🏗️ Arquitetura da Pasta `src`

### **1. Components** (`src/components/`)

Componentes React que formam a interface da aplicação.

#### **Componentes Principais:**

- **MainPage.tsx** - Componente raiz que organiza a aplicação em 4 abas principais
- **dialogs/** - Modais e diálogos
  - `AddMissingCredentialsDialog.tsx` - Diálogo para adicionar credenciais faltantes ao fazer upload de workflows
- **pages/** - Páginas das abas
  - `Workflows.tsx` - Gerenciamento de workflows (upload e download)
  - `Enviroments.tsx` - CRUD de ambientes
  - `Credentials.tsx` - CRUD de credenciais genéricas
  - `EnvironmentCredentials.tsx` - Mapping de credenciais por ambiente
- **ui/** - Componentes reutilizáveis (Radix UI + Tailwind)
  - `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `popover.tsx`, `select.tsx`, `table.tsx`, `tabs.tsx`

---

### **2. Layout** (`src/layout/`)

Componentes de layout e estrutura da interface.

- **GlobalFileAdder.tsx** - Drop zone para upload de arquivos
- **Header.tsx** - Cabeçalho da aplicação
- **TitleBar.tsx** - Barra de título customizada (típica de apps Tauri)

---

### **3. Hooks** (`src/hooks/`)

Custom React Hooks para lógica compartilhada.

- **useDatabaseManager.tsx** - Gerencia conexão e operações com banco de dados
- **useSelectedPath.tsx** - Gerencia o caminho selecionado para armazenar dados

---

### **4. Library** (`src/lib/`)

Lógica de negócio e utilidades.

#### **Arquivos Principais:**

- **workflowManager.ts** - Classe responsável por:
  - Upload de workflows via arquivo JSON
  - Download de workflows com credenciais customizadas por ambiente
  - Tratamento de credenciais faltantes
  - Interface: `N8NFindedCredential`, `WorkFlowFile`

- **workflowReplacer.ts** - Substitui placeholders de credenciais genéricas pelas credenciais específicas do ambiente

- **utils.ts** - Funções utilitárias

#### **Database** (`src/lib/database/`)

Sistema de persistência de dados usando LowDB adaptado para Tauri.

- **databaseManager.ts** - Orquestrador principal do banco de dados
  - Inicializa gerenciadores de ambientes, credenciais e mapeamentos
  - Carrega dados do arquivo `db.json`
- **databaseType.ts** - Tipos TypeScript da estrutura do banco de dados
  - `credentialsDatabaseType` - Schema completo

- **tauriLowDbAdapter.ts** - Adapter customizado que integra LowDB com Tauri para I/O de arquivos

#### **Models** (`src/lib/database/models/`)

Classes gerenciadoras de entidades específicas.

- **credentialsManager.ts** - Gerencia credenciais genéricas
- **enviromentsManager.ts** - Gerencia ambientes (dev, staging, prod, etc)
- **environmentCredentialsManager.ts** - Gerencia o mapeamento de credenciais por ambiente
- **EntityManagerInterface.ts** - Interface base para os managers

---

### **5. Assets** (`src/assets/`)

Recursos estáticos (imagens, ícones, etc)

---

### **6. Arquivo Principal**

- **App.tsx** - Componente raiz da aplicação
- **main.tsx** - Ponto de entrada do React
- **App.css** - Estilos globais
- **vite-env.d.ts** - Tipos do Vite

---

## 💾 Fluxo de Dados

### **Fluxo de Upload de Workflow:**

```
Usuário seleciona arquivo JSON
    ↓
WorkflowManager.addWorkFlowFromFile()
    ↓
Parseia JSON e valida credenciais
    ↓
Credenciais faltantes?
    ├─ SIM → Dispara AddMissingCredentialsDialog
    └─ NÃO → Armazena workflow no banco de dados
```

### **Fluxo de Download de Workflow:**

```
Usuário seleciona workflow e ambiente
    ↓
WorkflowManager.downloadWorkflow()
    ↓
WorkFlowReplacer substitui credenciais genéricas
    ↓
Gera novo JSON customizado
    ↓
Usuário escolhe local para salvar
    ↓
Arquivo JSON é gravado
```

---

## 🗄️ Estrutura do Banco de Dados

O banco de dados (em `db.json`) segue a seguinte estrutura:

```json
{
  "environments": [
    { "id": "...", "name": "production", ...}
  ],
  "credentials": [
    { "id": "...", "name": "api_key", "key": "API_KEY", ...}
  ],
  "environments_credentials": [
    { "id": "...", "environmentId": "...", "credentialId": "...", "value": "..." }
  ]
}
```

---

## 🛠️ Stack Tecnológico

### **Frontend:**

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### **Backend/Desktop:**

- **Tauri 2** - Desktop framework
- **Rust** - Backend (Tauri runtime)
- **LowDB 7** - Database (JSON-based)

### **Plugins Tauri:**

- `@tauri-apps/plugin-dialog` - Diálogos de arquivo
- `@tauri-apps/plugin-fs` - Sistema de arquivos
- `@tauri-apps/plugin-opener` - Abrir arquivos/URLs

### **Utilitários:**

- **react-dropzone** - Drag & drop
- **react-hot-toast** - Notificações
- **lucide-react** - Ícones

---

## 📑 Abas Principais da Aplicação

1. **Workflows** - Upload e download de workflows JSON
2. **Environments** - Gerenciar ambientes (criar, editar, deletar)
3. **Credentials** - Gerenciar credenciais genéricas
4. **Environment Credentials** - Mapear credenciais para cada ambiente

---

## 🔄 Padrões e Convenções

- **Classes gerenciadoras** em `src/lib/database/models/` implementam `EntityManagerInterface`
- **Tipos customizados** em `src/lib/database/databaseType.ts`
- **Componentes UI** separados em `src/components/ui/` (reutilizáveis)
- **Notificações** via `react-hot-toast`
- **Styling** com Tailwind CSS classes
- **Database updates** disparam callbacks via `onUpdate`

---

## 📌 Pontos de Entrada

- **App.tsx** → MainPage.tsx → Abas (WorkflowsTab, EnvironmentsTab, etc)
- **Database** → DatabaseManager inicializado via hook `useDatabaseManager`
- **Workflows** → WorkflowManager (upload/download) + WorkFlowReplacer (substituição de credenciais)

---

## 🎯 Objetivo Principal

Centralizar o gerenciamento de workflows N8N em múltiplos ambientes, permitindo:

- ✅ Manter workflows versionados no GitHub
- ✅ Facilitar troca de ambiente de workflows
- ✅ Gerenciar credenciais de forma segura e organizada
- ✅ Automatizar a substituição de credenciais por ambiente
