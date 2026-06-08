# Anitto MVP

ANA 마니또를 위한 `Anitto` 웹사이트입니다. React, Next.js, Vue 없이 HTML/CSS/Vanilla JavaScript와 Supabase로 구성되어 있습니다.

## 파일 구조

- `index.html`: 기본 화면 구조
- `styles.css`: 반응형 UI 스타일
- `app.js`: Supabase 연동, 회원가입, 로그인, 파티 참여, 미션, 미션 요청, 쪽지, 확성기, 추리, 랭킹, 관리자 기능
- `schema.sql`: Supabase 테이블과 기본 RLS 정책

## 실행 방법

1. Supabase 프로젝트를 만듭니다.
2. Supabase SQL Editor에서 `schema.sql`을 실행합니다.
3. Supabase Dashboard에서 `Authentication > Sign In / Providers > Email`로 이동합니다.
4. `Email` provider의 `Allow new users to sign up`을 켭니다.
5. 이메일 확인 옵션은 꺼두는 것을 권장합니다. 이 앱은 사용자가 이메일을 직접 입력하지 않고, 닉네임 기반 내부 이메일을 자동 생성합니다.
6. `app.js` 상단의 값을 실제 프로젝트 값으로 바꿉니다.

```js
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

7. `index.html`을 브라우저로 엽니다.

## 회원가입 흐름

첫 화면에서는 이름, 닉네임, 비밀번호만 입력합니다. 회원가입 요청 시 `real_name`, `nickname`이 Auth metadata에 저장되고, `schema.sql`의 트리거가 `profiles` 행을 자동 생성합니다.

```js
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      real_name: realName,
      nickname: nickname
    }
  }
})
```

닉네임 기반 로그인을 만들기 위해 앱 내부에서 `nickname-hash@anitto.app` 형태의 이메일을 자동 생성합니다. 화면에는 이메일 입력칸이 보이지 않습니다.

## 파티 참여 흐름

회원가입 후 로그인하면 홈 화면에 `파티 참여하기` 버튼이 표시됩니다. 이 버튼을 누른 사용자만 관리자의 게임 시작 시 마니또 배정 대상이 됩니다. 관리자 계정은 게임에 참여하지 않습니다.

## 관리자 만들기

첫 관리자 계정을 가입한 뒤 Supabase SQL Editor에서 해당 닉네임을 관리자로 변경합니다.

```sql
update profiles
set is_admin = true
where nickname = '관리자닉네임';
```

## 참고

현재 RLS 정책은 MVP 개발과 테스트를 쉽게 하기 위해 넓게 열려 있습니다. 실제 배포 전에는 관리자 전용 쓰기, 본인 데이터만 수정, 마니또 비공개 조회 같은 정책을 더 엄격하게 분리해야 합니다.
