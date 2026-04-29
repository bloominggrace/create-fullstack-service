---
description: NestJS 개발 규칙을 설명한다.
paths:
  - 'apps/server/**'
---

# 코드 작성 원칙

1. 기본적인 코드 작성 원칙은 NestJS 공식 문서를 따른다.
2. NestJS 메커니즘을 파괴하지 않는다.

# MikroORM 정책

- 반드시 `EntityManager`만 사용하고, `EntityRepository`는 사용하지 않는다.
- 여러 변경의 원자성이 필요할 때는 반드시 `@Transactional()`을 사용한다.

# 모듈 정책

- NestJS 표준 모듈 구조를 따른다.
- 하나의 도메인은 하나의 모듈로 표현한다.

# 컨트롤러 정책

- 라우트는 버저닝을 위해 `v{n}/`으로 시작한다.
- 라우트는 RESTful을 기본으로 하고 kebab-case로 명명한다.
- 라우트는 `@HttpCode`를 사용하여 올바른 상태 코드를 명시한다.
- 경로 파라미터는 타입에 맞는 파이프로 검증한다.
- `@Expose`된 필드만 반환하기 위해 `mapTo`로 응답 DTO에 매핑한다.

# 가드 정책

- OR 조합은 `Any()`를 사용한다.
  - 예시 1: `@UseGuards(Any(EntraIdGuard, ApiKeyGuard))`

# 서비스 정책

- 메서드는 SRP(단일 책임 원칙)를 지킨다.
  - 예시 1: 변경, 삭제 메서드는 조회를 수행하지 않는다.
- 메서드 이름은 NestJS CRUD 표준을 따르고, 검색은 `search`, 커서 페이지네이션은 `scroll`을 사용한다.
- 파라미터와 반환은 값이 하나면 그대로, 여럿이면 객체로 묶는다.
- 에러는 의미에 맞는 HTTP 예외로 변환한다.
  - 예시 1: `NotFoundError`는 `NotFoundException`으로 변환한다.
  - 예시 2: `UniqueConstraintViolationException`은 `ConflictException`으로 변환한다.

# 엔티티 정책

- PK는 UUIDv7을 사용하고 `uuidv7()`으로 생성한다.
- 자동 채움 필드는 `Opt`를 붙인다.
- 변경 추적이 필요한 엔티티는 `createdAt`, `updatedAt`을 둔다.
- 고아 레코드를 방지하기 위해 관계 필드는 `deleteRule`을 명시한다.

# DTO 정책

- 파일 이름은 `{동작}-{도메인}.dto.ts` 형태로 한다.
  - 예시 1: `create-user.dto.ts`
  - 예시 2: `find-users.dto.ts`
- 입력 DTO는 `Dto`, 응답 DTO는 `Res` 접미사를 붙인다.
  - 예시 1: `CreateUserDto`, `CreateUserRes`
  - 예시 2: `FindUsersDto`, `FindUsersRes`
- 입력은 `class-validator`로 검증한다.
- 의도치 않은 정보 유출을 막기 위해 응답 필드는 `@Expose()`로 명시한다.

# 테스트 정책

- 테스트 제목은 한글로 작성한다.
- 구현 변경에 영향받지 않도록 테스트 제목은 도메인 언어로 서술한다.
- 실 환경과 유사한 환경을 구축하기 위해 인프라를 사용하여 테스트한다.
- 테스트 간 격리는 트랜잭션 롤백으로 한다.
- 테스트 데이터는 픽스쳐를 사용한다.
  - 예시 1: `Random.userFixture()`
  - 예시 2: `Random.userFixture({ id: 'abc' })`
