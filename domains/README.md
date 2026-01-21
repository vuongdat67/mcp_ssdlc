# Domain Plugin System

Thư mục chứa các domain definitions. Mỗi domain là 1 folder với các file YAML.

## Structure
```
domains/
├── healthcare/    # HIPAA, PHI, HL7/FHIR
├── fintech/       # PCI-DSS, SOX, banking
├── generic/       # Default fallback
├── custom/        # User-defined domains
└── _schema/       # JSON Schema for validation
```

## Tự tạo domain mới

1. Tạo folder mới: `domains/your-domain/`
2. Tạo 3 files:
   - `domain.yaml` - Stakeholders, data types
   - `compliance.yaml` - Regulations
   - `threats.yaml` - Domain-specific threats
