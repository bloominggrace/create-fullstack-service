---
description: React 개발 규칙을 설명한다.
paths:
  - 'apps/client/**'
---

# 코드 작성 원칙

1. 기본적인 코드 작성 원칙은 React 공식 문서를 따른다.
2. React 메커니즘을 우회하지 않는다.
3. 자동 생성 파일은 직접 편집하지 않는다.
4. `export default` 는 사용하지 않는다.

# 임포트 정책

- 같은 배럴 안의 파일끼리는 상대 경로로 임포트한다.
- 다른 배럴의 파일은 `@/` 별칭으로 그 배럴을 통해 임포트한다.

# 타입 정책

- 타입 선언은 `interface` 대신 `type` 을 권장한다.
  - 가변 제네릭 타입은 `&` 로만 조합 가능하고 `interface` 의 `extends` 는 부모 타입이 확정되어야 한다.
    - 예시 1: `type WithQueryStatus<T> = T & { isLoading: boolean; isError: boolean }`
  - React 내장 타입은 `type` 으로 정의되어 있어 `&` 조합이 자연스럽다.
    - 예시 2: `type ParagraphProps = { children: ReactNode } & ComponentProps<'p'>`

# 레이어 정책

- 레이어는 하위부터 `common`, `features`, `pages` 순이다.
- 하위 레이어는 상위 레이어를 사용할 수 없다.
- 같은 레이어끼리는 서로 참조할 수 있다.
- `common`은 비즈니스 로직과 무관한 코드를 둔다.
  - 예시 1: `common/ui/select`
- `features`는 여러 페이지에서 재사용하는 비즈니스 로직 코드를 둔다.
  - 예시 1: `features/ui/select`
- `pages`는 한 페이지에 종속된 코드를 둔다.

# 이름 정책

- 컴포넌트 파일은 PascalCase로 명명한다.
- 훅 파일은 `use{이름}.ts`로 명명한다.
- 그 외 파일과 디렉터리는 kebab-case로 명명한다.
- 핸들러는 호출 시점이 아닌 동작으로 `handle{동사}{명사}`로 명명한다.
  - 예시 1: `handleChallengeOtp`
  - 예시 2: `handleCompleteOtp`
  - 예시 3: `handleResendOtp`
  - 예시 4: `handleShowCaptcha`

# 필드 정렬 정책

- Props의 필드는 값 및 변경 함수, 이벤트, 스타일, 자식 순으로 정렬한다.
  - 예시 1:
    ```ts
    type ComboboxProps = {
      defaultValue?: string;
      disabled?: boolean;
      invalid?: boolean;
      onChange?: (value: string) => void;
      className?: string;
      children: ReactNode;
    };
    ```
- Context의 필드는 값 및 변경 함수, 이벤트, 스타일, DOM 참조 순으로 정렬한다.
  - 예시 1:
    ```ts
    type SelectContextValue = {
      selectedValue: string;
      setSelectedValue: (value: string) => void;
      isOpen: boolean;
      setIsOpen: (isOpen: boolean) => void;
      onChange?: (value: string) => void;
      size: SelectSize;
      selectTriggerRef: RefObject<HTMLButtonElement | null>;
    };
    ```

# 폼 정책

- `onSubmit` 핸들러에서 `new FormData(e.currentTarget)`으로 값을 읽는다.

# 검증 정책

- `validateSearch`에는 Zod를 사용한다.
- 간단한 검증은 직접 구현한다.
  - 예시 1: `URL.canParse(url.trim())`

# 스타일 정책

- 클래스는 항상 `cn`으로 정의한다.
  - 예시 1: `className={cn('flex')}`
- 변형이 필요한 경우에는 `cva`로 정의한다.
  - 예시 1: `className={cn(variants({ size }), 'inline-flex items-center')}`
