# Frontend Work Plan - Sistema de Gestión de Inventario

## Resumen Ejecutivo

Este documento define el plan de trabajo para desarrollar el frontend que consumirá el backend NestJS de gestión de inventario. El backend cuenta con **21 controladores** y más de **120 endpoints** organizados en **11 módulos principales**.

### Información del Backend

- **Ubicación del Backend**: `C:\Users\Usuario\Documents\GitHub\improved-parakeet`
- **Documentación de Endpoints**: La documentación completa de los endpoints está disponible en [`docs/postman`](./postman) de este repositorio
- **Tecnología Backend**: NestJS con PostgreSQL
- **API Base URL**: Se configurará según el entorno (desarrollo/producción)

### Principios Arquitectónicos

Este frontend sigue tres principios arquitectónicos fundamentales:

1. **Screaming Architecture**: La estructura de carpetas "grita" el dominio del negocio, no el framework
2. **Clean Architecture**: Separación de capas con dependencias hacia adentro
3. **Hexagonal Architecture (Ports & Adapters)**: El dominio en el centro, adaptadores para infraestructura

---

## 1. Stack Tecnológico Frontend

### Framework y Librerías Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14+ | Framework React con App Router, Server Components |
| **React** | 19 | Librería UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4 | Framework de estilos utility-first |
| **Framer Motion** | Latest | Animaciones y transiciones |
| **next-intl** | Latest | Internacionalización (EN/ES) |

### Librerías Adicionales Recomendadas

| Librería | Propósito |
|----------|-----------|
| **@tanstack/react-query** | Gestión de estado servidor, cache, mutaciones |
| **axios** | Cliente HTTP con interceptores |
| **zod** | Validación de formularios y datos |
| **react-hook-form** | Gestión de formularios |
| **date-fns** | Manipulación de fechas |
| **recharts** / **chart.js** | Gráficos para reportes |
| **@tanstack/react-table** | Tablas con paginación, filtros, ordenamiento |
| **sonner** / **react-hot-toast** | Notificaciones |
| **lucide-react** | Iconos |

---

## 2. Arquitectura: Screaming + Clean + Hexagonal

### 2.1 Principios Fundamentales

#### Screaming Architecture
> "La arquitectura debe gritar el propósito del sistema" — Robert C. Martin

La estructura de carpetas refleja el **dominio del negocio**, no el framework:

```
❌ INCORRECTO (Framework-centric)     ✅ CORRECTO (Domain-centric)
src/                                   src/
├── components/                        ├── modules/
├── hooks/                             │   ├── inventory/        ← GRITA "Inventario"
├── utils/                             │   ├── sales/            ← GRITA "Ventas"
├── services/                          │   ├── returns/          ← GRITA "Devoluciones"
└── pages/                             │   └── authentication/   ← GRITA "Autenticación"
```

#### Clean Architecture - La Regla de Dependencia

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                            │
│  (Next.js pages, API clients, UI components, localStorage)   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   APPLICATION                        │    │
│  │         (Use Cases, State Management)                │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │                  DOMAIN                      │    │    │
│  │  │    (Entities, Value Objects, Interfaces)     │    │    │
│  │  │         🎯 CERO dependencias externas        │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Dependencias: Infrastructure → Application → Domain
              (hacia adentro, NUNCA hacia afuera)
```

#### Hexagonal Architecture (Ports & Adapters)

```
                    ┌──────────────────┐
                    │   UI Adapter     │
                    │  (React Pages)   │
                    └────────┬─────────┘
                             │
              ┌──────────────▼──────────────┐
              │         DRIVER PORTS         │
              │    (Use Case Interfaces)     │
              └──────────────┬───────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      APPLICATION CORE        │
              │                              │
              │  ┌────────────────────────┐  │
              │  │        DOMAIN          │  │
              │  │  Entities, VOs, Rules  │  │
              │  └────────────────────────┘  │
              │                              │
              └──────────────┬───────────────┘
                             │
              ┌──────────────▼──────────────┐
              │        DRIVEN PORTS          │
              │   (Repository Interfaces)    │
              └──────────────┬───────────────┘
                             │
                    ┌────────▼─────────┐
                    │ Infrastructure   │
                    │  (API Client)    │
                    └──────────────────┘
```

---

### 2.2 Estructura de Carpetas - Screaming Architecture

```
src/
│
├── modules/                              # 🎯 BOUNDED CONTEXTS (Screaming!)
│   │
│   ├── inventory/                        # ══════════════════════════════
│   │   │                                 # MÓDULO: GESTIÓN DE INVENTARIO
│   │   │                                 # ══════════════════════════════
│   │   │
│   │   ├── domain/                       # 🔷 CAPA DE DOMINIO (centro)
│   │   │   ├── entities/
│   │   │   │   ├── Product.ts            # Entidad con comportamiento
│   │   │   │   ├── Warehouse.ts
│   │   │   │   ├── Movement.ts
│   │   │   │   ├── Transfer.ts
│   │   │   │   └── StockLevel.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ProductSku.ts         # Valor inmutable con validación
│   │   │   │   ├── Quantity.ts
│   │   │   │   ├── Money.ts
│   │   │   │   ├── MovementType.ts
│   │   │   │   └── TransferStatus.ts
│   │   │   ├── errors/
│   │   │   │   ├── InsufficientStockError.ts
│   │   │   │   ├── InvalidTransferError.ts
│   │   │   │   └── ProductNotFoundError.ts
│   │   │   └── ports/                    # 🔌 DRIVEN PORTS (interfaces)
│   │   │       ├── ProductRepository.ts  # Contrato, NO implementación
│   │   │       ├── WarehouseRepository.ts
│   │   │       ├── MovementRepository.ts
│   │   │       └── TransferRepository.ts
│   │   │
│   │   ├── application/                  # 🔶 CAPA DE APLICACIÓN
│   │   │   ├── use-cases/                # Casos de uso (orquestadores)
│   │   │   │   ├── products/
│   │   │   │   │   ├── CreateProduct.ts
│   │   │   │   │   ├── UpdateProduct.ts
│   │   │   │   │   ├── GetProducts.ts
│   │   │   │   │   └── GetProductById.ts
│   │   │   │   ├── warehouses/
│   │   │   │   │   ├── CreateWarehouse.ts
│   │   │   │   │   └── GetWarehouses.ts
│   │   │   │   ├── movements/
│   │   │   │   │   ├── CreateMovement.ts
│   │   │   │   │   ├── PostMovement.ts
│   │   │   │   │   └── GetMovements.ts
│   │   │   │   ├── transfers/
│   │   │   │   │   ├── InitiateTransfer.ts
│   │   │   │   │   ├── ConfirmTransfer.ts
│   │   │   │   │   ├── ReceiveTransfer.ts
│   │   │   │   │   └── CancelTransfer.ts
│   │   │   │   └── stock/
│   │   │   │       ├── GetStockLevels.ts
│   │   │   │       └── CheckLowStock.ts
│   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   │   ├── CreateProductDto.ts
│   │   │   │   ├── ProductResponseDto.ts
│   │   │   │   └── ...
│   │   │   └── ports/                    # 🔌 DRIVER PORTS
│   │   │       ├── ProductUseCases.ts    # Interface para UI
│   │   │       └── MovementUseCases.ts
│   │   │
│   │   ├── infrastructure/               # 🔷 CAPA DE INFRAESTRUCTURA
│   │   │   ├── adapters/                 # Implementaciones de ports
│   │   │   │   ├── ApiProductRepository.ts
│   │   │   │   ├── ApiWarehouseRepository.ts
│   │   │   │   ├── ApiMovementRepository.ts
│   │   │   │   └── ApiTransferRepository.ts
│   │   │   ├── mappers/                  # API ↔ Domain converters
│   │   │   │   ├── ProductMapper.ts
│   │   │   │   └── MovementMapper.ts
│   │   │   └── hooks/                    # React Query hooks (adapters)
│   │   │       ├── useProducts.ts
│   │   │       ├── useWarehouses.ts
│   │   │       ├── useMovements.ts
│   │   │       └── useTransfers.ts
│   │   │
│   │   ├── presentation/                 # 🎨 CAPA DE PRESENTACIÓN
│   │   │   ├── components/               # Componentes del módulo
│   │   │   │   ├── ProductsTable.tsx
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── WarehousesTable.tsx
│   │   │   │   ├── MovementsTable.tsx
│   │   │   │   ├── MovementForm.tsx
│   │   │   │   ├── TransfersTable.tsx
│   │   │   │   ├── TransferForm.tsx
│   │   │   │   ├── TransferStatusStepper.tsx
│   │   │   │   ├── StockTable.tsx
│   │   │   │   └── LowStockAlert.tsx
│   │   │   ├── pages/                    # Page components
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   ├── WarehousesPage.tsx
│   │   │   │   ├── MovementsPage.tsx
│   │   │   │   ├── TransfersPage.tsx
│   │   │   │   └── StockPage.tsx
│   │   │   └── view-models/              # Presentational state
│   │   │       ├── useProductsViewModel.ts
│   │   │       └── useMovementsViewModel.ts
│   │   │
│   │   └── index.ts                      # Public API del módulo
│   │
│   ├── sales/                            # ══════════════════════════════
│   │   │                                 # MÓDULO: GESTIÓN DE VENTAS
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Sale.ts
│   │   │   │   └── SaleLine.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── SaleStatus.ts
│   │   │   │   └── SalePrice.ts
│   │   │   ├── errors/
│   │   │   │   └── SaleValidationError.ts
│   │   │   └── ports/
│   │   │       └── SaleRepository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── CreateSale.ts
│   │   │   │   ├── ConfirmSale.ts
│   │   │   │   ├── CancelSale.ts
│   │   │   │   ├── AddSaleLine.ts
│   │   │   │   └── GetSales.ts
│   │   │   └── dto/
│   │   ├── infrastructure/
│   │   │   ├── adapters/
│   │   │   │   └── ApiSaleRepository.ts
│   │   │   └── hooks/
│   │   │       └── useSales.ts
│   │   ├── presentation/
│   │   │   ├── components/
│   │   │   │   ├── SalesTable.tsx
│   │   │   │   ├── SaleForm.tsx
│   │   │   │   ├── SaleLineEditor.tsx
│   │   │   │   └── SaleDetail.tsx
│   │   │   └── pages/
│   │   │       ├── SalesPage.tsx
│   │   │       └── SaleDetailPage.tsx
│   │   └── index.ts
│   │
│   ├── returns/                          # ══════════════════════════════
│   │   │                                 # MÓDULO: GESTIÓN DE DEVOLUCIONES
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Return.ts
│   │   │   │   └── ReturnLine.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ReturnType.ts         # CUSTOMER | SUPPLIER
│   │   │   │   └── ReturnStatus.ts
│   │   │   └── ports/
│   │   │       └── ReturnRepository.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── CreateReturn.ts
│   │   │       ├── ConfirmReturn.ts
│   │   │       └── GetReturns.ts
│   │   ├── infrastructure/
│   │   │   ├── adapters/
│   │   │   └── hooks/
│   │   └── presentation/
│   │       ├── components/
│   │       └── pages/
│   │
│   ├── reports/                          # ══════════════════════════════
│   │   │                                 # MÓDULO: REPORTES Y ANALYTICS
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Report.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ReportType.ts
│   │   │   │   ├── DateRange.ts
│   │   │   │   └── ExportFormat.ts
│   │   │   └── ports/
│   │   │       └── ReportRepository.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── GenerateInventoryReport.ts
│   │   │       ├── GenerateSalesReport.ts
│   │   │       └── ExportReport.ts
│   │   ├── infrastructure/
│   │   │   ├── adapters/
│   │   │   └── hooks/
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── ReportsDashboard.tsx
│   │       │   ├── ReportViewer.tsx
│   │       │   ├── ReportFilters.tsx
│   │       │   ├── ReportChart.tsx
│   │       │   └── ExportButton.tsx
│   │       └── pages/
│   │
│   ├── imports/                          # ══════════════════════════════
│   │   │                                 # MÓDULO: IMPORTACIÓN DE DATOS
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── ImportBatch.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ImportType.ts
│   │   │   │   └── ImportStatus.ts
│   │   │   └── ports/
│   │   │       └── ImportRepository.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── PreviewImport.ts
│   │   │       ├── ExecuteImport.ts
│   │   │       └── DownloadTemplate.ts
│   │   ├── infrastructure/
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── ImportWizard.tsx
│   │       │   ├── FileUploader.tsx
│   │       │   ├── ImportPreview.tsx
│   │       │   └── ValidationErrors.tsx
│   │       └── pages/
│   │
│   ├── authentication/                   # ══════════════════════════════
│   │   │                                 # MÓDULO: AUTENTICACIÓN
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── User.ts
│   │   │   │   └── Session.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Email.ts
│   │   │   │   ├── Password.ts
│   │   │   │   └── Token.ts
│   │   │   ├── errors/
│   │   │   │   ├── InvalidCredentialsError.ts
│   │   │   │   └── SessionExpiredError.ts
│   │   │   └── ports/
│   │   │       ├── AuthRepository.ts
│   │   │       └── TokenStorage.ts       # Port para storage
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── Login.ts
│   │   │   │   ├── Logout.ts
│   │   │   │   ├── RefreshToken.ts
│   │   │   │   ├── RequestPasswordReset.ts
│   │   │   │   └── ResetPassword.ts
│   │   │   └── ports/
│   │   │       └── AuthUseCases.ts
│   │   ├── infrastructure/
│   │   │   ├── adapters/
│   │   │   │   ├── ApiAuthRepository.ts
│   │   │   │   └── CookieTokenStorage.ts # Implementación del port
│   │   │   └── hooks/
│   │   │       └── useAuth.ts
│   │   ├── presentation/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── OtpInput.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── ResetPasswordPage.tsx
│   │   │   └── guards/
│   │   │       └── AuthGuard.tsx
│   │   └── index.ts
│   │
│   ├── users/                            # ══════════════════════════════
│   │   │                                 # MÓDULO: GESTIÓN DE USUARIOS
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── UserAccount.ts
│   │   │   ├── value-objects/
│   │   │   │   └── UserStatus.ts
│   │   │   └── ports/
│   │   │       └── UserRepository.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── CreateUser.ts
│   │   │       ├── UpdateUser.ts
│   │   │       ├── ChangeUserStatus.ts
│   │   │       └── AssignRole.ts
│   │   ├── infrastructure/
│   │   └── presentation/
│   │
│   ├── roles/                            # ══════════════════════════════
│   │   │                                 # MÓDULO: ROLES Y PERMISOS
│   │   │                                 # ══════════════════════════════
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Role.ts
│   │   │   │   └── Permission.ts
│   │   │   └── ports/
│   │   │       └── RoleRepository.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │
│   └── audit/                            # ══════════════════════════════
│       │                                 # MÓDULO: AUDITORÍA
│       │                                 # ══════════════════════════════
│       ├── domain/
│       │   ├── entities/
│       │   │   └── AuditLog.ts
│       │   └── ports/
│       │       └── AuditRepository.ts
│       ├── application/
│       │   └── use-cases/
│       │       ├── GetAuditLogs.ts
│       │       └── GetEntityHistory.ts
│       ├── infrastructure/
│       └── presentation/
│
├── shared/                               # 🔧 SHARED KERNEL
│   │                                     # Código compartido entre módulos
│   │
│   ├── domain/                           # Dominio compartido
│   │   ├── value-objects/
│   │   │   ├── Id.ts                     # UUID value object
│   │   │   ├── Pagination.ts
│   │   │   └── DateRange.ts
│   │   ├── errors/
│   │   │   ├── DomainError.ts            # Base class
│   │   │   ├── ValidationError.ts
│   │   │   └── NotFoundError.ts
│   │   └── interfaces/
│   │       ├── Entity.ts                 # Base entity interface
│   │       ├── ValueObject.ts
│   │       └── Repository.ts             # Generic repository interface
│   │
│   ├── application/                      # Aplicación compartida
│   │   ├── ports/
│   │   │   └── HttpClient.ts             # Port para HTTP
│   │   └── dto/
│   │       ├── PaginatedResponse.ts
│   │       └── ApiResponse.ts
│   │
│   └── infrastructure/                   # Infraestructura compartida
│       ├── http/
│       │   └── AxiosHttpClient.ts        # Adapter para HTTP
│       ├── storage/
│       │   └── LocalStorageAdapter.ts
│       └── config/
│           └── apiConfig.ts
│
├── ui/                                   # 🎨 DESIGN SYSTEM
│   │                                     # Componentes UI puros (sin lógica de negocio)
│   │
│   ├── primitives/                       # Componentes atómicos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   └── TextArea.tsx
│   │
│   ├── components/                       # Componentes compuestos
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tabs.tsx
│   │   ├── Table/
│   │   │   ├── Table.tsx
│   │   │   ├── TableHeader.tsx
│   │   │   ├── TableBody.tsx
│   │   │   ├── TableRow.tsx
│   │   │   └── TablePagination.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── forms/                            # Componentes de formulario
│   │   ├── FormField.tsx
│   │   ├── FormLabel.tsx
│   │   ├── FormError.tsx
│   │   ├── DatePicker.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── FileUploader.tsx
│   │   └── SearchInput.tsx
│   │
│   ├── layout/                           # Componentes de layout
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── PageHeader.tsx
│   │   └── Container.tsx
│   │
│   ├── feedback/                         # Componentes de feedback
│   │   ├── Alert.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Stepper.tsx
│   │   └── Tooltip.tsx
│   │
│   └── charts/                           # Componentes de gráficos
│       ├── BarChart.tsx
│       ├── LineChart.tsx
│       ├── PieChart.tsx
│       └── AreaChart.tsx
│
├── app/                                  # 📱 NEXT.JS APP ROUTER
│   │                                     # Solo routing y composición
│   │
│   ├── [locale]/                         # i18n routing
│   │   ├── (auth)/                       # Grupo: rutas públicas
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Importa LoginPage del módulo
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/                  # Grupo: rutas protegidas
│   │   │   ├── layout.tsx                # Dashboard layout
│   │   │   ├── page.tsx                  # Dashboard home
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx          # → inventory/ProductsPage
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── warehouses/
│   │   │   │   │   └── ...
│   │   │   │   ├── movements/
│   │   │   │   │   └── ...
│   │   │   │   ├── transfers/
│   │   │   │   │   └── ...
│   │   │   │   └── stock/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── sales/
│   │   │   │   ├── page.tsx              # → sales/SalesPage
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── returns/
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx              # → reports/ReportsDashboard
│   │   │   │   └── [type]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── imports/
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── users/
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── roles/
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── audit/
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   └── layout.tsx                    # Root layout con providers
│   │
│   ├── api/                              # API Routes (BFF si necesario)
│   └── globals.css
│
├── config/                               # ⚙️ CONFIGURACIÓN
│   ├── di/                               # Dependency Injection
│   │   ├── container.ts                  # Composición de dependencias
│   │   └── providers.tsx                 # React context providers
│   ├── i18n/
│   │   ├── config.ts
│   │   └── request.ts
│   └── env.ts                            # Type-safe env variables
│
├── messages/                             # 🌍 TRADUCCIONES
│   ├── en.json
│   └── es.json
│
├── middleware.ts                         # Next.js middleware
└── i18n.ts                               # next-intl config
```

---

## 3. Implementación de Capas

### 3.1 Capa de Dominio (Core)

La capa de dominio es el **corazón del sistema**. No tiene dependencias externas.

#### Entidad (con comportamiento)

```typescript
// modules/inventory/domain/entities/Product.ts

import { ProductSku } from '../value-objects/ProductSku';
import { Money } from '../value-objects/Money';
import { ProductStatus } from '../value-objects/ProductStatus';

export interface ProductProps {
  id: string;
  sku: ProductSku;
  name: string;
  description?: string;
  unit: string;
  barcode?: string;
  brand?: string;
  model?: string;
  price?: Money;
  status: ProductStatus;
  costMethod: 'AVERAGE' | 'FIFO' | 'LIFO';
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private constructor(private props: ProductProps) {}

  // Factory method
  static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    return new Product({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Reconstitution from persistence
  static fromPersistence(props: ProductProps): Product {
    return new Product(props);
  }

  // Getters
  get id(): string { return this.props.id; }
  get sku(): ProductSku { return this.props.sku; }
  get name(): string { return this.props.name; }
  get status(): ProductStatus { return this.props.status; }
  // ... más getters

  // Comportamiento de negocio
  activate(): void {
    if (this.props.status.isDiscontinued()) {
      throw new Error('Cannot activate a discontinued product');
    }
    this.props.status = ProductStatus.active();
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.status = ProductStatus.inactive();
    this.props.updatedAt = new Date();
  }

  discontinue(): void {
    this.props.status = ProductStatus.discontinued();
    this.props.updatedAt = new Date();
  }

  updatePrice(newPrice: Money): void {
    if (newPrice.isNegative()) {
      throw new Error('Price cannot be negative');
    }
    this.props.price = newPrice;
    this.props.updatedAt = new Date();
  }

  // Para persistencia
  toPrimitives(): ProductProps {
    return { ...this.props };
  }
}
```

#### Value Object (inmutable)

```typescript
// modules/inventory/domain/value-objects/ProductSku.ts

export class ProductSku {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (value.length > 50) {
      throw new Error('SKU cannot exceed 50 characters');
    }
    if (!/^[A-Z0-9-]+$/i.test(value)) {
      throw new Error('SKU can only contain alphanumeric characters and hyphens');
    }
  }

  static create(value: string): ProductSku {
    return new ProductSku(value.toUpperCase());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductSku): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

```typescript
// modules/inventory/domain/value-objects/Money.ts

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {}

  static create(amount: number, currency: string = 'USD'): Money {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
    return new Money(Math.round(amount * 100) / 100, currency.toUpperCase());
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency.toUpperCase());
  }

  getAmount(): number { return this.amount; }
  getCurrency(): string { return this.currency; }

  isNegative(): boolean { return this.amount < 0; }
  isZero(): boolean { return this.amount === 0; }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return Money.create(this.amount * factor, this.currency);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot operate on different currencies: ${this.currency} vs ${other.currency}`);
    }
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  format(locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }
}
```

#### Port (Interface del Repositorio)

```typescript
// modules/inventory/domain/ports/ProductRepository.ts

import { Product } from '../entities/Product';
import { ProductSku } from '../value-objects/ProductSku';
import { Pagination } from '@/shared/domain/value-objects/Pagination';

export interface ProductFilters {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProducts {
  items: Product[];
  pagination: Pagination;
}

// 🔌 DRIVEN PORT - Define QUÉ necesita el dominio, no CÓMO se implementa
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: ProductSku): Promise<Product | null>;
  findAll(filters: ProductFilters, page: number, limit: number): Promise<PaginatedProducts>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  exists(sku: ProductSku): Promise<boolean>;
}
```

---

### 3.2 Capa de Aplicación (Use Cases)

Los casos de uso orquestan la lógica de dominio y coordinan con la infraestructura.

```typescript
// modules/inventory/application/use-cases/products/CreateProduct.ts

import { Product } from '../../domain/entities/Product';
import { ProductSku } from '../../domain/value-objects/ProductSku';
import { ProductStatus } from '../../domain/value-objects/ProductStatus';
import { ProductRepository } from '../../domain/ports/ProductRepository';
import { CreateProductDto } from '../dto/CreateProductDto';
import { ProductResponseDto } from '../dto/ProductResponseDto';

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    // 1. Crear Value Objects (validación incluida)
    const sku = ProductSku.create(dto.sku);
    const status = ProductStatus.create(dto.status ?? 'ACTIVE');

    // 2. Verificar que no exista
    const exists = await this.productRepository.exists(sku);
    if (exists) {
      throw new Error(`Product with SKU ${sku.getValue()} already exists`);
    }

    // 3. Crear entidad de dominio
    const product = Product.create({
      sku,
      name: dto.name,
      description: dto.description,
      unit: dto.unit,
      barcode: dto.barcode,
      brand: dto.brand,
      model: dto.model,
      status,
      costMethod: dto.costMethod ?? 'AVERAGE',
    });

    // 4. Persistir
    await this.productRepository.save(product);

    // 5. Retornar DTO
    return ProductResponseDto.fromDomain(product);
  }
}
```

```typescript
// modules/inventory/application/use-cases/transfers/ConfirmTransfer.ts

import { TransferRepository } from '../../domain/ports/TransferRepository';
import { MovementRepository } from '../../domain/ports/MovementRepository';
import { TransferStatus } from '../../domain/value-objects/TransferStatus';

export class ConfirmTransferUseCase {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly movementRepository: MovementRepository
  ) {}

  async execute(transferId: string): Promise<void> {
    // 1. Obtener transferencia
    const transfer = await this.transferRepository.findById(transferId);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    // 2. Validar estado actual
    if (!transfer.canBeConfirmed()) {
      throw new Error(`Transfer cannot be confirmed. Current status: ${transfer.status}`);
    }

    // 3. Cambiar estado (lógica de dominio en la entidad)
    transfer.confirm();

    // 4. Crear movimiento de salida en almacén origen
    const outMovement = transfer.createOutboundMovement();
    await this.movementRepository.save(outMovement);

    // 5. Persistir cambios
    await this.transferRepository.update(transfer);
  }
}
```

#### DTOs (Data Transfer Objects)

```typescript
// modules/inventory/application/dto/CreateProductDto.ts

import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  unit: z.enum(['UNIT', 'KG', 'LB', 'BOX', 'PACK']),
  barcode: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']).optional(),
  costMethod: z.enum(['AVERAGE', 'FIFO', 'LIFO']).optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
```

```typescript
// modules/inventory/application/dto/ProductResponseDto.ts

import { Product } from '../../domain/entities/Product';

export class ProductResponseDto {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly unit: string,
    public readonly barcode: string | undefined,
    public readonly brand: string | undefined,
    public readonly model: string | undefined,
    public readonly status: string,
    public readonly costMethod: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static fromDomain(product: Product): ProductResponseDto {
    const props = product.toPrimitives();
    return new ProductResponseDto(
      props.id,
      props.sku.getValue(),
      props.name,
      props.description,
      props.unit,
      props.barcode,
      props.brand,
      props.model,
      props.status.getValue(),
      props.costMethod,
      props.createdAt.toISOString(),
      props.updatedAt.toISOString()
    );
  }
}
```

---

### 3.3 Capa de Infraestructura (Adapters)

#### Adapter del Repositorio (implementación del Port)

```typescript
// modules/inventory/infrastructure/adapters/ApiProductRepository.ts

import { Product } from '../../domain/entities/Product';
import { ProductSku } from '../../domain/value-objects/ProductSku';
import { ProductRepository, ProductFilters, PaginatedProducts } from '../../domain/ports/ProductRepository';
import { HttpClient } from '@/shared/application/ports/HttpClient';
import { ProductMapper } from '../mappers/ProductMapper';
import { Pagination } from '@/shared/domain/value-objects/Pagination';

// 🔌 DRIVEN ADAPTER - Implementa el port del dominio
export class ApiProductRepository implements ProductRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await this.httpClient.get<ApiProductResponse>(
        `/inventory/products/${id}`
      );
      return ProductMapper.toDomain(response.data);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async findBySku(sku: ProductSku): Promise<Product | null> {
    const result = await this.findAll({ search: sku.getValue() }, 1, 1);
    return result.items[0] ?? null;
  }

  async findAll(
    filters: ProductFilters,
    page: number,
    limit: number
  ): Promise<PaginatedProducts> {
    const response = await this.httpClient.get<ApiPaginatedResponse<ApiProductResponse>>(
      '/inventory/products',
      {
        params: { ...filters, page, limit },
      }
    );

    return {
      items: response.data.data.map(ProductMapper.toDomain),
      pagination: Pagination.create({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }),
    };
  }

  async save(product: Product): Promise<void> {
    const apiDto = ProductMapper.toApi(product);
    await this.httpClient.post('/inventory/products', apiDto);
  }

  async update(product: Product): Promise<void> {
    const apiDto = ProductMapper.toApi(product);
    await this.httpClient.put(`/inventory/products/${product.id}`, apiDto);
  }

  async exists(sku: ProductSku): Promise<boolean> {
    const product = await this.findBySku(sku);
    return product !== null;
  }
}

// Tipos de la API (infraestructura)
interface ApiProductResponse {
  id: string;
  sku: string;
  name: string;
  description?: string;
  unit: string;
  barcode?: string;
  brand?: string;
  model?: string;
  price?: number;
  currency?: string;
  status: string;
  costMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### Mapper (API ↔ Domain)

```typescript
// modules/inventory/infrastructure/mappers/ProductMapper.ts

import { Product, ProductProps } from '../../domain/entities/Product';
import { ProductSku } from '../../domain/value-objects/ProductSku';
import { ProductStatus } from '../../domain/value-objects/ProductStatus';
import { Money } from '../../domain/value-objects/Money';

export class ProductMapper {
  static toDomain(apiResponse: ApiProductResponse): Product {
    return Product.fromPersistence({
      id: apiResponse.id,
      sku: ProductSku.create(apiResponse.sku),
      name: apiResponse.name,
      description: apiResponse.description,
      unit: apiResponse.unit,
      barcode: apiResponse.barcode,
      brand: apiResponse.brand,
      model: apiResponse.model,
      price: apiResponse.price
        ? Money.create(apiResponse.price, apiResponse.currency ?? 'USD')
        : undefined,
      status: ProductStatus.create(apiResponse.status),
      costMethod: apiResponse.costMethod as 'AVERAGE' | 'FIFO' | 'LIFO',
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    });
  }

  static toApi(product: Product): ApiCreateProductRequest {
    const props = product.toPrimitives();
    return {
      sku: props.sku.getValue(),
      name: props.name,
      description: props.description,
      unit: props.unit,
      barcode: props.barcode,
      brand: props.brand,
      model: props.model,
      status: props.status.getValue(),
      costMethod: props.costMethod,
    };
  }
}
```

#### React Query Hooks (UI Adapters)

```typescript
// modules/inventory/infrastructure/hooks/useProducts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContainer } from '@/config/di/providers';
import { CreateProductDto } from '../../application/dto/CreateProductDto';
import { ProductFilters } from '../../domain/ports/ProductRepository';

export function useProducts(filters: ProductFilters, page: number, limit: number) {
  const { getProductsUseCase } = useContainer();

  return useQuery({
    queryKey: ['products', filters, page, limit],
    queryFn: () => getProductsUseCase.execute(filters, page, limit),
  });
}

export function useProduct(id: string) {
  const { getProductByIdUseCase } = useContainer();

  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { createProductUseCase } = useContainer();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProductUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { updateProductUseCase } = useContainer();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      updateProductUseCase.execute(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
}
```

---

### 3.4 Capa de Presentación

#### View Model (Estado de presentación)

```typescript
// modules/inventory/presentation/view-models/useProductsViewModel.ts

import { useState, useMemo } from 'react';
import { useProducts, useCreateProduct } from '../../infrastructure/hooks/useProducts';
import { ProductFilters } from '../../domain/ports/ProductRepository';
import { CreateProductDto } from '../../application/dto/CreateProductDto';

export function useProductsViewModel() {
  // State
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Queries
  const { data, isLoading, isFetching, error } = useProducts(filters, page, limit);
  const createMutation = useCreateProduct();

  // Derived state
  const products = useMemo(() => data?.items ?? [], [data]);
  const pagination = data?.pagination;
  const isEmpty = !isLoading && products.length === 0;
  const hasError = !!error;

  // Actions
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setPage(1);
  };

  const handleFilterByStatus = (status: string | undefined) => {
    setFilters(prev => ({ ...prev, status }));
    setPage(1);
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreate = async (dto: CreateProductDto) => {
    await createMutation.mutateAsync(dto);
    setIsCreateModalOpen(false);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return {
    // State
    products,
    pagination,
    isLoading,
    isFetching,
    isEmpty,
    hasError,
    error,
    isCreateModalOpen,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Actions
    handleSearch,
    handleFilterByStatus,
    handleSort,
    handlePageChange,
    handleCreate,
    openCreateModal,
    closeCreateModal,
  };
}
```

#### Page Component

```typescript
// modules/inventory/presentation/pages/ProductsPage.tsx

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { useProductsViewModel } from '../view-models/useProductsViewModel';
import { ProductsTable } from '../components/ProductsTable';
import { ProductForm } from '../components/ProductForm';
import { PageHeader } from '@/ui/layout/PageHeader';
import { Button } from '@/ui/primitives/Button';
import { Modal } from '@/ui/components/Modal';
import { SearchInput } from '@/ui/forms/SearchInput';
import { Select } from '@/ui/primitives/Select';
import { EmptyState } from '@/ui/components/EmptyState';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { PermissionGate } from '@/modules/authentication/presentation/guards/PermissionGate';
import { PERMISSIONS } from '@/modules/roles/domain/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function ProductsPage() {
  const t = useTranslations('Inventory.Products');
  const vm = useProductsViewModel();

  return (
    <ErrorBoundary fallback={<div>{t('error.loading')}</div>}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <PermissionGate permission={PERMISSIONS.PRODUCTS_CREATE}>
              <Button onClick={vm.openCreateModal}>
                {t('actions.create')}
              </Button>
            </PermissionGate>
          }
        />

        {/* Filters */}
        <div className="flex gap-4">
          <SearchInput
            placeholder={t('filters.search')}
            onSearch={vm.handleSearch}
          />
          <Select
            placeholder={t('filters.status')}
            options={[
              { value: 'ACTIVE', label: t('status.active') },
              { value: 'INACTIVE', label: t('status.inactive') },
              { value: 'DISCONTINUED', label: t('status.discontinued') },
            ]}
            onChange={vm.handleFilterByStatus}
          />
        </div>

        {/* Content */}
        {vm.isEmpty ? (
          <EmptyState
            title={t('empty.title')}
            description={t('empty.description')}
            action={
              <PermissionGate permission={PERMISSIONS.PRODUCTS_CREATE}>
                <Button onClick={vm.openCreateModal}>
                  {t('empty.action')}
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <ProductsTable
            products={vm.products}
            pagination={vm.pagination}
            isLoading={vm.isLoading}
            onPageChange={vm.handlePageChange}
            onSort={vm.handleSort}
          />
        )}

        {/* Create Modal */}
        <Modal
          isOpen={vm.isCreateModalOpen}
          onClose={vm.closeCreateModal}
          title={t('create.title')}
        >
          <ProductForm
            onSubmit={vm.handleCreate}
            isSubmitting={vm.isCreating}
            error={vm.createError}
          />
        </Modal>
      </motion.div>
    </ErrorBoundary>
  );
}
```

---

### 3.5 Dependency Injection (Composición)

```typescript
// config/di/container.ts

import { AxiosHttpClient } from '@/shared/infrastructure/http/AxiosHttpClient';

// Inventory
import { ApiProductRepository } from '@/modules/inventory/infrastructure/adapters/ApiProductRepository';
import { ApiWarehouseRepository } from '@/modules/inventory/infrastructure/adapters/ApiWarehouseRepository';
import { CreateProductUseCase } from '@/modules/inventory/application/use-cases/products/CreateProduct';
import { GetProductsUseCase } from '@/modules/inventory/application/use-cases/products/GetProducts';
import { GetProductByIdUseCase } from '@/modules/inventory/application/use-cases/products/GetProductById';

// Auth
import { ApiAuthRepository } from '@/modules/authentication/infrastructure/adapters/ApiAuthRepository';
import { CookieTokenStorage } from '@/modules/authentication/infrastructure/adapters/CookieTokenStorage';
import { LoginUseCase } from '@/modules/authentication/application/use-cases/Login';

export function createContainer() {
  // Shared infrastructure
  const httpClient = new AxiosHttpClient();

  // Repositories (adapters)
  const productRepository = new ApiProductRepository(httpClient);
  const warehouseRepository = new ApiWarehouseRepository(httpClient);
  const authRepository = new ApiAuthRepository(httpClient);
  const tokenStorage = new CookieTokenStorage();

  // Use Cases
  const createProductUseCase = new CreateProductUseCase(productRepository);
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  const loginUseCase = new LoginUseCase(authRepository, tokenStorage);

  return {
    // Infrastructure
    httpClient,

    // Repositories
    productRepository,
    warehouseRepository,
    authRepository,
    tokenStorage,

    // Use Cases
    createProductUseCase,
    getProductsUseCase,
    getProductByIdUseCase,
    loginUseCase,
  };
}

export type Container = ReturnType<typeof createContainer>;
```

```typescript
// config/di/providers.tsx

'use client';

import { createContext, useContext, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContainer, Container } from './container';

const ContainerContext = createContext<Container | null>(null);

export function useContainer(): Container {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error('useContainer must be used within ContainerProvider');
  }
  return container;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const container = useMemo(() => createContainer(), []);
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);

  return (
    <ContainerContext.Provider value={container}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ContainerContext.Provider>
  );
}
```

---

## 4. Resumen de Capas por Responsabilidad

| Capa | Responsabilidad | Dependencias | Ejemplo |
|------|-----------------|--------------|---------|
| **Domain** | Lógica de negocio pura | NINGUNA | `Product`, `ProductSku`, `ProductRepository` (interface) |
| **Application** | Orquestación, casos de uso | Domain | `CreateProductUseCase`, DTOs |
| **Infrastructure** | Implementación técnica | Application, Domain | `ApiProductRepository`, `ProductMapper` |
| **Presentation** | UI y estado visual | Application | `ProductsPage`, `useProductsViewModel` |

### Flujo de una Petición

```
1. Usuario hace clic en "Crear Producto"
   ↓
2. ProductsPage llama a vm.handleCreate(dto)
   ↓
3. ViewModel llama a createMutation.mutateAsync(dto)
   ↓
4. Hook useCreateProduct usa createProductUseCase.execute(dto)
   ↓
5. CreateProductUseCase:
   - Crea Value Objects (validación)
   - Verifica existencia via productRepository.exists()
   - Crea entidad Product.create()
   - Persiste via productRepository.save()
   ↓
6. ApiProductRepository.save():
   - Usa ProductMapper.toApi() para convertir
   - Llama a httpClient.post()
   ↓
7. API responde → React Query invalida cache → UI se actualiza
```

---

## 5. Testing por Capa

### Domain Tests (Unit)

```typescript
// modules/inventory/domain/__tests__/Product.test.ts

describe('Product', () => {
  it('should create a product with valid data', () => {
    const product = Product.create({
      sku: ProductSku.create('SKU-001'),
      name: 'Test Product',
      unit: 'UNIT',
      status: ProductStatus.active(),
      costMethod: 'AVERAGE',
    });

    expect(product.id).toBeDefined();
    expect(product.sku.getValue()).toBe('SKU-001');
    expect(product.status.isActive()).toBe(true);
  });

  it('should not activate a discontinued product', () => {
    const product = Product.create({
      // ...props
      status: ProductStatus.discontinued(),
    });

    expect(() => product.activate()).toThrow('Cannot activate a discontinued product');
  });
});
```

### Application Tests (Integration)

```typescript
// modules/inventory/application/__tests__/CreateProduct.test.ts

describe('CreateProductUseCase', () => {
  it('should create product when SKU does not exist', async () => {
    // Arrange
    const mockRepository: ProductRepository = {
      exists: jest.fn().mockResolvedValue(false),
      save: jest.fn().mockResolvedValue(undefined),
      // ...otros métodos
    };
    const useCase = new CreateProductUseCase(mockRepository);

    // Act
    const result = await useCase.execute({
      sku: 'NEW-SKU',
      name: 'New Product',
      unit: 'UNIT',
    });

    // Assert
    expect(mockRepository.exists).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.sku).toBe('NEW-SKU');
  });

  it('should throw error when SKU already exists', async () => {
    const mockRepository: ProductRepository = {
      exists: jest.fn().mockResolvedValue(true),
      // ...
    };
    const useCase = new CreateProductUseCase(mockRepository);

    await expect(
      useCase.execute({ sku: 'EXISTING', name: 'Test', unit: 'UNIT' })
    ).rejects.toThrow('already exists');
  });
});
```

### Presentation Tests (Component)

```typescript
// modules/inventory/presentation/__tests__/ProductsPage.test.tsx

describe('ProductsPage', () => {
  it('should show empty state when no products', () => {
    // Mock del ViewModel
    jest.mock('../view-models/useProductsViewModel', () => ({
      useProductsViewModel: () => ({
        products: [],
        isLoading: false,
        isEmpty: true,
        // ...
      }),
    }));

    render(<ProductsPage />);

    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });
});
```

---

## 6. Checklist de Arquitectura

### Validación de Clean Architecture

- [ ] **Domain** no importa nada de Application o Infrastructure
- [ ] **Application** solo importa de Domain
- [ ] **Infrastructure** implementa interfaces definidas en Domain
- [ ] **Presentation** usa hooks de Infrastructure, no llama a API directamente

### Validación de Hexagonal

- [ ] Ports (interfaces) definidos en Domain o Application
- [ ] Adapters implementan los Ports en Infrastructure
- [ ] Se puede cambiar la implementación sin tocar el dominio

### Validación de Screaming Architecture

- [ ] La estructura de carpetas refleja el dominio del negocio
- [ ] Al ver `src/modules/`, se entiende qué hace el sistema
- [ ] Los nombres de carpetas son términos de negocio, no técnicos

---

## 7. Plan de Desarrollo por Fases

### Fase 1: Fundamentos (Semana 1-2)

- [ ] Setup proyecto con estructura de carpetas
- [ ] Configurar shared kernel (errors, value objects base)
- [ ] Implementar módulo de Authentication completo
- [ ] Configurar DI container y providers
- [ ] Crear componentes UI base

### Fase 2: Inventario Core (Semana 3-4)

- [ ] Dominio: Product, Warehouse, Stock entities
- [ ] Use Cases: CRUD de productos y almacenes
- [ ] Adapters: API repositories
- [ ] Presentation: Páginas y tablas

### Fase 3: Movimientos y Transferencias (Semana 5-6)

- [ ] Dominio: Movement, Transfer entities con estados
- [ ] Use Cases: Flujos de estado (DRAFT → POSTED)
- [ ] Presentation: Formularios con líneas dinámicas

### Fase 4: Ventas y Devoluciones (Semana 7-8)

- [ ] Dominio: Sale, Return entities
- [ ] Use Cases: Confirmar, cancelar, líneas
- [ ] Presentation: Flujos completos

### Fase 5: Reportes e Importaciones (Semana 9-10)

- [ ] Use Cases: Generación y exportación de reportes
- [ ] Use Cases: Import wizard con validación
- [ ] Presentation: Gráficos y tablas de reportes

### Fase 6: Administración (Semana 11-12)

- [ ] Módulos: Users, Roles, Audit
- [ ] Matriz de permisos
- [ ] Configuración de organización

### Fase 7: Polish (Semana 13-14)

- [ ] Testing completo por capas
- [ ] Optimización de rendimiento
- [ ] Documentación de arquitectura

---

## 8. Referencia de Endpoints por Módulo

### Inventory Module
| Recurso | Endpoints |
|---------|-----------|
| Products | `GET/POST /inventory/products`, `GET/PUT /inventory/products/:id` |
| Warehouses | `GET/POST /inventory/warehouses`, `GET /inventory/warehouses/:id` |
| Movements | `GET/POST /inventory/movements`, `POST /inventory/movements/:id/post` |
| Transfers | `GET/POST /inventory/transfers`, `POST /inventory/transfers/:id/{confirm,receive,reject,cancel}` |
| Stock | `GET /inventory/stock` |

### Sales Module
| Recurso | Endpoints |
|---------|-----------|
| Sales | `GET/POST /sales`, `GET/PATCH /sales/:id`, `POST /sales/:id/{confirm,cancel}` |
| Lines | `POST/DELETE /sales/:id/lines` |

### Returns Module
| Recurso | Endpoints |
|---------|-----------|
| Returns | `GET/POST /returns`, `GET/PUT /returns/:id`, `POST /returns/:id/{confirm,cancel}` |
| Lines | `POST/DELETE /returns/:id/lines` |

### Reports Module
| Recurso | Endpoints |
|---------|-----------|
| View | `GET /reports/{inventory,sales,returns}/*/view` |
| Export | `POST /reports/{inventory,sales,returns}/*/export` |

### Authentication Module
| Recurso | Endpoints |
|---------|-----------|
| Auth | `POST /auth/{login,logout,refresh}` |
| Password | `POST /password-reset/{request,verify-otp,reset}` |

### Users Module
| Recurso | Endpoints |
|---------|-----------|
| Users | `GET/POST /users`, `GET/PUT /users/:id`, `PATCH /users/:id/status` |
| Roles | `POST/DELETE /users/:id/roles` |

### Roles Module
| Recurso | Endpoints |
|---------|-----------|
| Roles | `GET/POST /roles`, `GET/PATCH/DELETE /roles/:id` |
| Permissions | `POST /roles/:id/permissions` |

### Audit Module
| Recurso | Endpoints |
|---------|-----------|
| Logs | `GET /audit/logs`, `GET /audit/logs/:id` |
| Activity | `GET /audit/users/:userId/activity` |
| History | `GET /audit/entities/:type/:id/history` |

---

*Documento generado para el proyecto de gestión de inventario.*
*Arquitectura: Screaming + Clean + Hexagonal*
*Última actualización: Enero 2026*
