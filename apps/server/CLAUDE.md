# 기술 스택

| 분류        | 기술         |
|-----------|------------|
| Language  | TypeScript |
| Framework | NestJS     |
| DB        | PostgreSQL |
| ORM       | MikroORM   |
| Cache     | Redis      |
| Queue     | BullMQ     |
| Test      | Vitest     |

# 작업 완료 조건

## 코드 변경

```bash
pnpm --filter server lint && pnpm --filter server type-check && pnpm --filter server build && NODE_ENV=test pnpm --filter server test
```

## DB 스키마 변경

DB 스키마를 변경했다면 마이그레이션 파일이 생성되었는지 반드시 확인한다.

```bash
NODE_ENV=development pnpm --filter server migration:generate
```
