---
description: TypeScript 개발 규칙을 설명한다.
paths:
  - '**/*.ts'
  - '**/*.tsx'
---

# 임포트 정책

- 임포트 시 `.ts`, `.tsx`를 표기하지 않는다.
- 사용하는 심볼만 `Named Import`로 가져오되, 이름이 충돌할 때만 `Namespace Import`로 구분한다.

# 변수 정책

- 객체에서 값을 꺼낼 때 기본값은 디스트럭처링으로 지정한다.
  - 예시 1:
    ```ts
    const { network = Network.MNO } = params;
    ```
- Boolean은 의미에 따라 형태를 다르게 한다.
  - 지속되는 상태, 속성, 능력은 `is`, `has`, `can`을 접두로 붙인다.
    - 예시 1: `isActive`
    - 예시 2: `hasChildren`
    - 예시 3: `canEdit`
  - 한 시점에 발생한 사건이나 결과는 접두 없이 과거분사로 쓴다.
    - 예시 1: `signedUp`
    - 예시 2: `created`
    - 예시 3: `verified`

# 제어 흐름 정책

- 분기는 한 줄짜리도 항상 중괄호 블록으로 감싼다.
- 같은 키를 열거형, 리터럴 등으로 분기할 때만 `switch`를 우선한다.
  - 임계값 비교나 복합 조건, 케이스 안에 추가 분기가 필요할 때는 `if`를 유지한다.

# 배치 정책

- 같은 의미 그룹의 함수는 인접 배치한다.
  - 예시 1:
    ```ts
    function getDeviceIdentifier(): string {
      return 'foo';
    }

    export async function getDeviceInfo(): Promise<DeviceInfo> {
      return {
        deviceIdentifier: getDeviceIdentifier(),
        deviceName: 'bar',
      };
    }
    ```