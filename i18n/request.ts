// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // 안전 가드: 지원 언어 아닌 경우 en으로 강제
  const l = locale === 'ko' || locale === 'en' ? locale : 'en';

  return {
    // ✅ 여기 'locale'을 반드시 돌려줍니다
    locale: l,
    messages: (await import(`../src/i18n/messages/${l}.json`)).default
  };
});
