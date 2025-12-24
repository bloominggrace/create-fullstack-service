# 🚀 Create Fullstack Service

## 서비스 생성

```shell
pnpx degit github:bloominggrace/create-fullstack-service
```

## 🚀 시작하기

원활한 개발을 위해 아래 순서대로 환경을 설정하고 실행해 주세요.

### 1. mise 설치

[mise 공식 설치 문서](https://mise.jdx.dev/getting-started.html)를 참고하여 mise를 설치합니다.

### 2. 런타임 환경 설정

```shell
mise trust
mise install
```

### 3. 인프라 실행

인프라를 실행할 때 `--env` 사용하여 환경을 선택할 수 있습니다.

```shell
mise run infra:up --env development
```

### 4. 의존성 설치

```shell
pnpm install
```

### 5. 환경 변수 설정

`.env.template`을 참고하여 환경 변수를 설정하세요.

### 6. 테스트 실행

테스트는 `NODE_ENV`가 `test`인 환경에서 실행되어야 합니다.

```shell
pnpm test
```

### 7. 개발 환경 실행

개발은 `NODE_ENV`가 `development`인 환경에서 실행되어야 합니다.

```shell
pnpm dev
```
