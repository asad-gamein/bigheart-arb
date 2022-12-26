import { GAME_TYPE, SCENE_TYPE } from "../common/managers/gameManager";
import { Accomplishment } from "./accomplishment";

export const ERROR_MSG = {
    INVALID_EMAIL: "ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﻋﻨﻮﺍﻥ ﺑﺮﻳﺪ ﺇﻟﻜﺘﺮﻭﻧﻲ ﺻﺤﻴﺢ",
    INVALID_NAME: "ﺍﻟﺮﺟﺎﺀ ﺇﺩﺧﺎﻝ ﺍﺳﻢ ﻣﻨﺎﺳﺐ",
    INVALID_PWD: "ﻳﺠﺐ ﺃﻥ ﺗﺘﻜﻮﻥ ﻛﻠﻤﺔ ﺍﻟﻤﺮﻭﺭ ﻣﻦ 8 ﺃﺣﺮﻑ ﻋﻠﻰ ﺍﻷﻗﻞ ﺑﻤﺎ ﻓﻲ ﺫﻟﻚ ﺣﺮﻑ ﻛﺒﻴﺮ ﻭﺍﺣﺪ ﻭﺣﺮﻑ ﺻﻐﻴﺮ ﻭﺭﻗﻢ ﻭﺣﺮﻑ ﺧﺎﺹ.",
    INVALID_USERNAME: "ﻳﺠﺐ ﺃﻥ ﻳﺒﺪﺃ ﺍﺳﻢ ﺍﻟﻤﺴﺘﺨﺪﻡ ﺑﺄﺣﺮﻑ ﻭﻳﺠﺐ ﺃﻥ ﻳﺤﺘﻮﻱ ﻋﻠﻰ ﺃﺣﺮﻑ ﻭﺃﺭﻗﺎﻡ ﻓﻘﻂ",
    INVALID_LENGTH: "ﻳﺠﺐ ﺃﻥ ﻳﺘﺮﺍﻭﺡ ﺍﺳﻢ ﺍﻟﻤﺴﺘﺨﺪﻡ ﺑﻴﻦ &min ﻭ &max ﺣﺮﻑ",
    INVALID_UNAME_EMAIL: "ﻳﺮﺟﻰ ﺇﺩﺧﺎﻝ ﺍﺳﻢ ﻣﺴﺘﺨﺪﻡ ﺃﻭ ﻋﻨﻮﺍﻥ ﺍﻟﺒﺮﻳﺪ ﺍﻹﻟﻜﺘﺮﻭﻧﻲ ﺻﺤﻴﺢ",
    INAVLIDE_CREDENTIALS: "ﺍﻟﺒﻴﺎﻧﺎﺕ ﻏﻴﺮ ﺻﺤﻴﺤﺔ",
};

export function getAccomplishments(pGameType: GAME_TYPE) {
    let generalFacts: any;
    let achievements: any;
    let headings: any;
    switch (pGameType) {
        case GAME_TYPE.EDUCATION:
            generalFacts = [
                `أن مؤسسة القلب الكبير تقوم ببناء المدارس، وتقدم المنح الدراسية <color=#b07221>هل تعلم</color>
للطلاب، والتدريبات اللازمة للمعلمين، وتسهل حصول الأطفال على الفرص التعليمية؟`,

                `أن هناك ﺃﻛﺜﺮ ﻣﻦ 15 ﻣﻠﻴﻮﻥ ﻃﺎﻟﺐ ﻓﻲ ﻣﻨﻄﻘﺔ ﺍﻟﺸﺮﻕ الأﻭﺳﻂ ﻏﻴﺮ ﻗﺎﺩﺭ ﻋﻠﻰ <color=#b07221>هل تعلم</color>
ﺍﻟﺬﻫﺎﺏ ﺇﻟﻰ ﺍﻟﻤﺪﺭﺳﺔ؟`,

                `أن ﻛﻞ 6 ﺃﻃﻔﺎﻝ ﻣﻦ ﺃﺻﻞ 10 يعانون ﻣﻦ ﻋﺴﺮ ﺍﻟﻘﺮﺍﺀﺓ ﻭﺍﻟﻜﺘﺎﺑﺔ ﻓﻲ ﻣﻨﻄﻘﺘﻨﺎ؟ <color=#b07221>هل تعلم</color>`,
            ];
            achievements = [
                `ﺔﻔﻠﺘﺨﻣ ﻝﻭﺩ ﻲﻓ ﺔﺳﺭﺪﻣ 15ٍ ﻦﻣ ﺮﺜﻛﺃ ﺡﻼﺻﺇﻭ ﺀﺎﻨﺒﺑ ﺖﻣﺎﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ﻯﺮﺧﺃ ﻥﺍﺪﻠﺑ ﺓﺪﻋﻭ ﺎﻳﺭﻮﺳﻭ ﻦﻴﻄﺴﻠﻓ ﻭ ﺮﺼﻣﻭ ﺎﻴﻨﻴﻛﻭ ﻥﺎﺘﺴﻛﺎﺑ ﻞﺜﻣ `,
                ` ﺏﻼﻄﻟﺍ ﻭ ﻦﻴﻳﺭﻮﺴﻟﺍ ﻦﻴﺌﺟﻼﻟﺍ ﺏﻼﻄﻠﻟ ﺔﻴﺳﺍﺭﺩ ﺎﺤﻨﻣ ﺖﻣﺪﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ﻞﻀﻓﺃ ﻼﺒﻘﺘﺴﻣ ﺍﻮﻨﻤﻀﻳﻭ ﻢﻬﻤﻴﻠﻌﺗ ﺍﻮﻠﻤﻜﻳ ﻰﺘﺣ ﻦﻴﻴﻨﻴﻄﺴﻠﻔﻟﺍ`,
                `ﺮﻴﻓﻮﺘﻟ ﺔﻗﺭﺎﺸﻟﺍ ﻲﻓ "ﻲﻤﻴﻠﻌﺘﻟﺍ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺰﻛﺮﻣ" ﺖﻘﻠﻃﺃ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
ﻙﺮﺗ ﻰﻟﺇ ﺍﻭﺮﻄﺿﺍ ﻦﻳﺬﻟﺍ ﻦﻣ ﺓﺪﺤﺘﻤﻟﺍ ﺔﻴﺑﺮﻌﻟﺍ ﺕﺍﺭﺎﻣﻹﺍ ﻲﻓ ﻦﻴﻤﻴﻘﻤﻟﺍ ﺏﺎﺒﺸﻠﻟ ﺔﻓﺮﻌﻤﻟﺍﻭ ﻢﻴﻠﻌﺘﻟﺍ
؟ﺔﺸﻴﻌﻤﻟﺍ ﺕﺎﻳﻮﺘﺴﻣ ﻲﻧﺪﺗﻭ ﺕﺎﻋﺍﺰﻨﻟﺍ ﺏﺒﺴﺑ ﺔﻴﻠﺻﻷﺍ ﻢﻬﻧﺍﺪﻠﺑ ﻦﻣ ﺭﺍﺮﻔﻟﺍﻭ ﺮﻜﺒﻣ ﻦﺳ ﻲﻓ ﺔﺳﺭﺪﻤﻟﺍ`,
            ];
            headings = ["حقائق عامة عن قطاع التعليم", "إنجازات مؤسسة القلب الكبير في قطاع التعليم"];
            break;
        case GAME_TYPE.LIVLIHOOD:
            generalFacts = [
                `أن ﺗﺤﺴﻴﻦ ﺍﻟﻤﺴﺘﻮﻯ ﺍﻟﻤﻌﻴﺸﻲ ﻳﻌﻨﻲ توفير ﺍﻻﺣﺘﻴﺎﺟﺎﺕ ﺍﻷﺳﺎﺳﻴﺔ ﻟﻠﻤﺤﺘﺎﺟﻴﻦ <color=#b07221>هل تعلم</color>
ﻭﺍﻟﻼﺟﺌﻴﻦ ﻟﻔﺘﺮﺓ ،ﻃﻮﻳﻠﺔ ﻭﻟﻴﺲ ﻟﻤﺮﺓ ﻭﺍﺣﺪﺓ ﻓﻘﻂ؟`,
                `أن ﺃﻛﺜﺮ ﻣﻦ 25 ﻣﻠﻴﻮﻥ ﺷﺎﺏ ﻓﻲ ﺍﻟﻤﻨﻄﻘﺔ ﺍﻟﻌﺮﺑﻴﺔ ﻻ ﻳﺬﻫﺒﻮﻥ ﺇﻟﻰ ﺍﻟﻤﺪﺭﺳﺔ <color=#b07221>هل تعلم</color>
ﻭ ﻟﻴﺲ ﻟﺪﻳﻬﻢ ﻭﻇﺎﺋﻒ؟`,
                "أن إﺣﺪى ﻃﺮﻕ ﺗﺤﺴﻴﻦ ﺣﻴﺎﺓ ﺍﻟﻼﺟﺌﻴﻦ ﻭﺍﻟﻤﺤﺘﺎﺟﻴﻦ ﻫﻲ ﺍﻟﻌﻤﻞ ﻟﻜﺴﺐ ﺍﻟﻤﺎﻝ؟ <color=#b07221>هل تعلم</color>",
            ];
            achievements = [
                `؟ةﺎﺘﻓﻭ ةﺃﺮﻣﺍ 4500 ﺐﻳﺭﺪﺘﻟ نﺎﺘﺴﻛﺎﺑ ﻲﻓ ﺔﻴﻌﻤﺘﺠﻣ ﺰﻛﺍﺮﻣ ءﺎﻨﺒﺑ ﺖﻣﺎﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ`,
                `اًﺪﺠﺴﻣﻭ ًﻻﺰﻨﻣ 20 ﻢﻀﺗ ﺮﺠﻴﻨﻟﺍ ﻲﻓ ﺔﻠﻣﺎﻛ ﺔﻳﺮﻗ ءﺎﻨﺒﺑ ﺖﻣﺎﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ﺔﻴﺴﻤﺸﻟﺍ ﺔﻗﺎﻄﻟﺍ ﺔﻤﻈﻧﺃﻭ عﺭﺍﺰﻣﻭ ﺰﺒﺨﻣﻭ هﺎﻴﻣ نﺍﺰﺧﻭ ﺔﻴﺋﺍﺪﺘﺑﺍ ﺔﺳﺭﺪﻣﻭ ةﺩﺎﻴﻋﻭ`,
                `تﺍﺭﺎﻬﻤﻟﺍ ﻢﻬﻤﻴﻠﻌﺗ لﻼﺧ ﻦﻣ ﺎﻴﻨﻴﻛ ﻲﻓ بﺎﺷﻭ ةﺃﺮﻣﺍ 300 تﺪﻋﺎﺳ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ﺔﺻﺎﺨﻟﺍ ﺔﻳﺭﺎﺠﺘﻟﺍ ﻢﻬﻌﻳﺭﺎﺸﻣ ءﺎﺸﻧﺈﺑ ﻢﻬﻟ حﺎﻤﺴﻟﺍ ﻰﺘﺣ وﺃ ﻒﺋﺎﻇﻭ ﻢﻬﻟ ﺮﻓﻮﺘﺳ ﻲﺘﻟﺍ`,
            ];
            headings = ["حقائق عامة عن قطاع تحسين المستوى المعيشي", "إنجازات مؤسسة القلب الكبير في قطاع تحسين المستوى المعيشي"];
            break;
        case GAME_TYPE.RELIEF:
            generalFacts = [
                `أن ﺍﻻﺳﺘﺠﺎﺑﺔ ﻟﺤﺎﻻﺕ ﺍﻟﻄﻮﺍﺭﺉ تكون ﺑﺄﺷﻜﺎﻝ ﻋﺪﻳﺪﺓ ﺑﻤﺎ ﻓﻲ ﺫﻟﻚ ﺗﻮﻓﻴﺮ <color=#b07221>هل تعلم</color>
ﺍﻟﻐﺬﺍﺀ ﻭﺍﻟﻤﺎﺀ ﻭﺍﻷﺩﻭﻳﺔ و ﺍﻟﻤﺄﻭﻯ؟`,
                `أن ﺍﻧﻔﺠﺎﺭ ﻣﻴﻨﺎﺀ ﺑﻴﺮﻭﺕ، ﻭﺍﻟﻔﻴﻀﺎﻧﺎﺕ ﻓﻲ ﺍﻟﺴﻮﺩﺍﻥ، ﻭﻭﺑﺎﺀ ﻛﻮﻓﻴﺪ-19 ﺍﻟﻌﺎﻟﻤﻲ <color=#b07221>هل تعلم</color>
ﻛﻠﻬﺎ ﺗﺘﻄﻠﺐ إﻏﺎﺛﺎﺕ ﻃﺎﺭﺋﺔ؟`,
                `أن ﻫﻨﺎﻙ 64 ﻣﻠﻴﻮﻥ ﺷﺨﺺ ﻓﻲ ﺍﻟﻤﻨﻄﻘﺔ ﺍﻟﻌﺮﺑﻴﺔ ﻳﻌﺎﻧﻮﻥ ﻣﻦ ﺍﻟﺠﻮﻉ <color=#b07221>هل تعلم</color>
ﻭﻳﻜﺎﻓﺤﻮﻥ للحصول ﻋﻠﻰ ﺍﻟﻐﺬﺍﺀ ﻓﻲ ﺍﻟﻮﻗﺖ ﺍﻟﺤﺎﻟﻲ؟`,
            ];
            achievements = [
                `رﺎﺠﻔﻧﺍ ﺪﻌﺑ ﻲﻓﺎﻌﺘﻟﺍ ﻰﻠﻋ ﺔﻠﺋﺎﻋ 3,000 ﻦﻣ ﺮﺜﻛﺃ تﺪﻋﺎﺳ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟نﺎﻨﺒﻟ ﻲﻓ تﻭﺮﻴﺑ ﺄﻓﺮﻣ`,
                `ﺢﻳﺮﺟ 2,000 ﻦﻣ ﺮﺜﻛﻷ ﻲﺴﻔﻨﻟﺍﻭ ﻲﺒﻄﻟﺍ ﻢﻋﺪﻟﺍ ﺖﻣﺪﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟سﺪﻘﻟﺍﻭ ةﺰﻏ ﻲﻓ ﻲﻨﻴﻄﺴﻠﻓ`,
                `تﺍﻭﺩﺃ ﻢﻬﺤﻨﻣ لﻼﺧ ﻦﻣ لﻭﺩ 6 ﻲﻓ ﻦﻴﺌﺟﻼﻟﺍ تﺪﻋﺎﺳ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ﺎﻧﻭﺭﻮﻛ سﻭﺮﻴﻓ ﺔﺑﺭﺎﺤﻤﻟ ﺔﻴﺼﺨﺸﻟﺍ ﺔﻓﺎﻈﻨﻟﺍﻭ ﺔﻣﻼﺴﻟﺍ`,
                `2,400 ﻦﻣ ﺮﺜﻛﻷ ىﺮﺧﺃ ﺔﻴﺋﺍﺬﻏ تﺍﺪﻋﺎﺴﻣﻭ مﺎﻌﻄﻟﺍ ﺖﻣﺪﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ءﺎﺑﻮﻟﺍ رﺎﺸﺘﻧﺍ ةﺮﺘﻓ لﻼﺧ ةﺪﺤﺘﻤﻟﺍ ﺔﻴﺑﺮﻌﻟﺍ تﺍﺭﺎﻣﻹﺍ ﻲﻓ ﻦﻴﻤﻴﻘﻤﻟﺍ ﻦﻣ ﺔﺟﺎﺘﺤﻣ ةﺮﺳﺃ`,
            ];
            headings = ["ﺣﻘﺎﺋﻖ ﻋﺎﻣﺔ ﻋﻦ ﻗﻄﺎﻉ ﺍﻻﺳﺘﺠﺎﺑﺔ ﻟﺤﺎﻻﺕ ﺍﻟﻄﻮﺍﺭﺉ", "إنجازات مؤسسة القلب الكبير في قطاع الاستجابة لحالات الطوارئ"];
            break;
        case GAME_TYPE.HEALTHCARE:
            generalFacts = [
                `أن ﻣﺸﺎﺭﻳﻊ ﺍﻟﺮﻋﺎﻳﺔ ﺍﻟﺼﺤﻴﺔ ﺗﺴﺎﻋﺪ ﺍﻟﻤﺠﺘﻤﻌﺎﺕ ﺍﻟﻤﺤﺘﺎﺟﺔ ﻣﻦ ﺧﻼﻝ ﺗﺪﺭﻳﺐ <color=#b07221>هل تعلم</color>
ﺍﻷﻃﺒﺎﺀ ﻭﺇﻋﻄﺎﺀ ﺍﻟﻤﺮﺿﻰ ﺍﻷﺩﻭﻳﺔ ﻭﺑﻨﺎﺀ ﺍﻟﻤﺴﺘﺸﻔﻴﺎﺕ ﻭﺍﻟﻌﻴﺎﺩﺍﺕ؟`,
                "أن 2 ﻣﻦ ﻛﻞ 3 ﺃﻃﻔﺎﻝ ﻏﻴﺮ ﻣﻄﻌﻤﻴﻦ ﻳﻌﻴﺸﻮﻥ ﻓﻲ ﺑﻠﺪﺍﻥ ﻏﻴﺮ ﺁﻣﻨﺔ؟ <color=#b07221>هل تعلم</color>",
                `أن ﺍﻷﻃﻔﺎﻝ ﺍﻟﺬﻳﻦ ﻳﻌﻴﺸﻮﻥ ﻓﻲ ﻣﻨﺎﻃﻖ ﺍﻟﻨﺰﺍﻉ ﻫﻢ ﺃﻛﺜﺮ ﻋﺮﺿﺔ ﻟﻠﻮﻓﺎﺓ <color=#b07221>هل تعلم</color>
ﺑﺜﻼﺙ ﻣﺮﺍﺕ عن الذين يعيشون في مناطق آمنة؟`,
            ];
            achievements = [
                `ﺮﺼﻣ ﻲﻓ مﺍﺭﻭﻸﻟ ﻲﻣﻮﻘﻟﺍ ﺪﻬﻌﻤﻟﺍ حﻼﺻﺇ ﻲﻓ تﺪﻋﺎﺳ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟ﺎًﻧﺎﺠﻣ نﺎﻃﺮﺴﻟﺍ ﻰﺿﺮﻣ ﻦﻣ ﺪﻳﺰﻤﻟﺍ جﻼﻋ ﻦﻣ ﻦﻜﻤﺘﻳ ﻰﺘﺣ`,
                `ﺔﻴﻃﺍﺮﻘﻤﻳﺪﻟﺍ ﻮﻐﻧﻮﻜﻟﺍ ﺔﻳﺭﻮﻬﻤﺟ ﻲﻓ ﺪﻳﺪﺟ ﻰﻔﺸﺘﺴﻣ ءﺎﻨﺒﺑ ﺖﻣﺎﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
؟مﺎﻋ ﻞﻛ ﺎًﻐﻟﺎﺑ 5,620و ﺔﺴﻣﺎﺨﻟﺍ ﻦﺳ نﻭﺩ ﻞﻔﻃ 8,300 مﺪﺨﻳ`,
                `ﺮﻴﻓﻮﺘﻟ نﺩﺭﻷﺍ ﻲﻓ ﻦﻴﺌﺟﻼﻟ ﻢﻴﺨﻣ ﻲﻓ ةﺩﺎﻴﻋ ءﺎﻨﺒﺑ ﺖﻣﺎﻗ ﺮﻴﺒﻜﻟﺍ ﺐﻠﻘﻟﺍ ﺔﺴﺳﺆﻣ نﺃ ﻢﻠﻌﺗ ﻞﻫ
ﺺﺨﺷ ﻒﻟﺃ 24 ﻢﻫﺩﺪﻋ ﻎﻟﺎﺒﻟﺍ ﻦﻴﺟﺎﺘﺤﻤﻟﺍﻭ ﻦﻴﺌﺟﻼﻟ ًﺎﻧﺎﺠﻣ جﻼﻌﻟﺍﻭ ﺔﻳﻭﺩﻻﺍ`,
            ];
            headings = ["حقائق عامة عن قطاع الرعاية الصحية", "ﺇﻧﺠﺎﺯﺍﺕ ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﻓﻲ ﻗﻄﺎﻉ ﺍﻟﺮﻋﺎﻳﺔ ﺍﻟﺼﺤﻴﺔ"];
            break;
        default:
            generalFacts = [];
            achievements = [];
            break;
    }
    return {
        generalFacts: generalFacts,
        achievements: achievements,
        headings: headings,
    };
}

export function getVoiceOvers(pGameType: GAME_TYPE) {
    let introduction: string;
    let tutorial: string;
    let end: string;
    let game_summary: string;
    switch (pGameType) {
        case GAME_TYPE.EDUCATION:
            introduction = `ﻥﺃ ﺪﻳﺮﺗ ﻲﺘﻟﺍ ﺔﻘﻳﺮﻄﻟﺍ ﺭﺎﺘﺨﻧ ﺎﻨﻋﺩ .ﻢﻴﻠﻌﺘﻟﺍ ﻉﺎﻄﻗ ﺭﺎﻴﺘﺧﺎﺑ ﺖﻤﻗ ﺪﻘﻟ
.ﺎﻬﺘﻌﻤﺟ ﻲﺘﻟﺍ ﺏﻮﻠﻘﻟﺎﺑ ﻉﺎﻄﻘﻟﺍ ﺍﺬﻫ ﺎﻬﺑ ﻢﻋﺪﺗ`;
            tutorial = `.ﺔﺒﺳﺎﻨﻤﻟﺍ لﻭﺪﻟﺍ ﻰﻟﺇ ﺔﻣﺯﻼﻟﺍ تﺎﺟﺎﻴﺘﺣﻻﺍ لﺎﺼﻳﺇﻭ ﺐﺤﺴﺑ ﻢﻗ .ﻢﻫﺪﻋﺎﺳﻭ ﺪﻠﺑ ﻞﻛ تﺎﺟﺎﻴﺘﺣﻻ ﻪﺒﺘﻧﺍ
.ﻂﻘﻓ ةﺪﺣﺍﻭ ﺔﺟﺎﺣ ﻰﻠﻋ ﺰﻛﺮﺗ ﻻﺃ لﻭﺎﺣ !ﺔﻋﺮﺴﺑ فﺮﺼﺘﻟﺍ ﻰﻟﺇ ﺔﺟﺎﺤﺑ ﻦﺤﻧ !عﺮﺳﺃ`;
            end = ` ﺓﺪﻋﺎﺴﻤﻟ ﺏﻮﻠﻘﻟﺍ ﻦﻣ xxx ـﺑ ﺖﻋﺮﺒﺗ ﺪﻘﻟ ،ﺱﺎﻨﻟﺍ ﻦﻣ ﺮﻴﺜﻜﻟﺍ ﺕﺪﻋﺎﺳ ﺪﻘﻟ !ﺖﻨﺴﺣﺃ
.ﻢﻴﻠﻌﺘﻟﺍ ﻦﻣ ﺪﻴﺟ ﻯﻮﺘﺴﻣ ﻰﻠﻋ ﻝﻮﺼﺤﻠﻟ ﺓﺩﺪﻌﺘﻣ ﻥﺍﺪﻠﺑ ﻲﻓ ﻦﻴﺟﺎﺘﺤﻤﻟﺍ ﺏﻼﻄﻟﺍ`;
            game_summary = `لقد استخدمت xxx  قلب لمساعدة الطلاب المحتاجين من  
:الحصول على مستوى جيد من التعليم في دول متعددة`;
            break;
        case GAME_TYPE.LIVLIHOOD:
            introduction = `ﺕﺎﺟﺎﻴﺘﺣﻻﺍﺮﻴﻓﻮﺗ ﻲﻓ ﻢﻫﺎﺴﻧ ﺎﻧﻮﻋﺩ .ﻲﺸﻴﻌﻤﻟﺍ ﻯﻮﺘﺴﻤﻟﺍ ﻦﻴﺴﺤﺗ ﻉﺎﻄﻗ ﺕﺮﺘﺧﺍ ﺪﻘﻟ
.ﺔﻔﻌﻀﺘﺴﻤﻟﺍ ﺕﺎﻌﻤﺘﺠﻤﻠﻟ ﺔﻴﺳﺎﺳﻷﺍ`;
            tutorial = `ﻞﻴﻤﺤﺘﻟ ﺓﺪﺣﺍﻭ ﺔﻘﻴﻗﺩ ﻚﻳﺪﻟ ﻉﺮﺳﺃ ،ﺔﺤﻴﺤﺼﻟﺍ ﺔﻨﺣﺎﺸﻟﺍ ﻲﻓ ﻖﻳﺩﺎﻨﺼﻟﺍ ﻊﺿﻭﻭ ﺐﺤﺴﺑ ﻢﻗ
.ﺎﻬﻌﻤﺠﺑ ﺖﻤﻗ ﻲﺘﻟﺍ ﺏﻮﻠﻘﻟﺍ ﻡﺍﺪﺨﺘﺳﺎﺑ ﺔﻨﺣﺎﺷ ﻞﻜﻟ ﻦﻴﻗﻭﺪﻨﺻ`;

            end = `ﺮﻴﻓﻮﺘﻟ ﺏﻮﻠﻘﻟﺍ ﻦﻣ xxxﺏ ﺖﻋﺮﺒﺗ ﺪﻘﻟ .ﺱﺎﻨﻟﺍ ﻦﻣ ﺮﻴﺜﻜﻟﺍ ﺕﺪﻋﺎﺳ ﺪﻘﻟ !ﺖﻨﺴﺣﺃ
.ﺔﺟﺎﺘﺤﻤﻟﺍ ﺕﺎﻌﻤﺘﺠﻤﻠﻟ ﺔﻣﺯﻼﻟﺍ ﺕﺎﻴﺳﺎﺳﻷﺍ`;
            game_summary = `لقد استخدمت xxx قلب لتوفير الأساسيات اللازمة
:للمجتمعات المحتاجة`;
            break;
        case GAME_TYPE.RELIEF:
            introduction = `ﺔﺛﺎﻏﻹﺍ ﻢﻳﺪﻘﺘﻟ نﻵﺍ ﺖﻗﻮﻟﺍ نﺎﺣ ،ئﺭﺍﻮﻄﻟﺍ تﻻﺎﺤﻟ ﺔﺑﺎﺠﺘﺳﻻﺍ عﺎﻄﻗ ﻲﻓ ﻢﻜﺑ ﺎًﺒﺣﺮﻣ
ﻢﺘﻴﻟ ﺔﻴﺛﺎﻏﺇ ﻖﻳﺩﺎﻨﺻ 5 ﻞﻘﻧ ﻲﻫ ﻚﺘﻤﻬﻣﻭ ،ﺔﻔﻌﻀﺘﺴﻤﻟﺍ تﺎﻌﻤﺘﺠﻤﻠﻟ ﺔﻴﻧﺎﺴﻧﻹﺍ
.ةﺮﺋﺎﻄﻟﺍ ﻲﻓ ﺎﻬﻨﺤﺷ`;
            tutorial = "";
            end = `ﻢﻳﺪﻘﺘﻟ ﺏﻮﻠﻘﻟﺍ ﻦﻣ xxx ﺏ ﺖﻋﺮﺒﺗ ﺪﻘﻟ ،ﺱﺎﻨﻟﺍ ﻦﻣ ﺮﻴﺜﻜﻟﺍ ﺕﺪﻋﺎﺳ ﺪﻘﻟ !ﺖﻨﺴﺣﺃ
.ﻦﻴﺟﺎﺘﺤﻤﻠﻟ ﺔﻴﻧﺎﺴﻧﻹﺍ ﺔﺛﺎﻏﻹﺍ`;
            game_summary = `لقد استخدمت xxx قلب لتقديم الإغاثة الإنسانية
:للمحتاجين`;
            break;
        case GAME_TYPE.HEALTHCARE:
            introduction = `،ﺔﻴﺤﺼﻟﺍ ﺔﻳﺎﻋﺮﻟﺍ ﻉﺎﻄﻗ ﻢﻋﺪﻟ ﺎﻬﻌﻤﺟ ﻢﺗ ﻲﺘﻟﺍ ﺏﻮﻠﻘﻟﺍ ﻡﺍﺪﺨﺘﺳﻻ ﻥﻵﺍ ﺖﻗﻮﻟﺍ ﻥﺎﺣ
ﻊﺿﻭ ﻝﻭﺎﺣ .ﻰﻔﺸﺘﺴﻤﻟﺍ ﻲﻓ ﺎﻬﻌﺿﻭ ﺭﺎﺴﻴﻟﺍ ﻰﻠﻋ ﺓﺩﻮﺟﻮﻤﻟﺍ ﺕﺍﺪﻌﻤﻟﺍ ﺩﺪﺣ
ﻲﺘﻟﺍ ﺏﻮﻠﻘﻟﺍ ﻡﺪﺨﺘﺳﺍ .ﺐﻴﺒﻄﻟﺍ ﺕﺎﻤﻴﻠﻌﺗ ﻉﺎﺒﺗﺎﺑ ﺕﺍﺪﻌﻤﻟﺍ ﻦﻣ ﻦﻜﻤﻣ ﺭﺪﻗ ﺮﺒﻛﺃ
.ﻚﻟﺬﺑ ﻡﺎﻴﻘﻠﻟ ﺎﻬﺘﻌﻤﺟ`;
            tutorial = "";
            end = `ﻢﻳﺪﻘﺘﻟ ﺏﻮﻠﻘﻟﺍ ﻦﻣ xxxﺏ ﺖﻋﺮﺒﺗ ﺪﻘﻟ .ﺱﺎﻨﻟﺍ ﻦﻣ ﺮﻴﺜﻜﻟﺍ ﺕﺪﻋﺎﺳ ﺪﻘﻟ !ﺖﻨﺴﺣﺃ
.ﺕﺎﻴﻔﺸﺘﺴﻤﻟﺍ ﻯﺪﺣﻹ ﺔﻴﻟﺎﻋ ﺓﺩﻮﺟ ﺕﺍﺫ ﺔﻴﺤﺻ ﺕﺎﻣﺪﺧ`;
            game_summary = `لقد استخدمت xxx قلب لتقديم خدمات صحية ذات
:جودة عالية لإحدى المستشفيات`;
            break;
        default:
            introduction = "";
            tutorial = "";
            end = "";
            game_summary = "";
            break;
    }
    return {
        introduction: introduction,
        tutorial: tutorial,
        end: end,
        game_summary: game_summary,
    };
}

export function getQuestionier(pGameType: GAME_TYPE) {
    let questions: any;
    switch (pGameType) {
        case GAME_TYPE.EDUCATION:
            questions = [
                {
                    question: "So do you like bread?",
                    options: ["Yemen", "Paris", "No where"],
                    answer: 1,
                },
                {
                    question: "Where is courage the cowerdly dog",
                    options: ["Yemen", "Paris", "No where"],
                    answer: 1,
                },
                {
                    question: "What is  true",
                    options: ["!false", "!0", "!null"],
                    answer: 1,
                },
            ];

            break;
        case GAME_TYPE.LIVLIHOOD:
            questions = [
                {
                    question: "So do you like bread?",
                    option1: "Yemen",
                    option2: "Paris",
                    option3: "No where",
                    answer: 1,
                },
                {
                    question: "Where is courage the cowerdly dog",
                    option1: "Yemen",
                    option2: "Paris",
                    option3: "No where",
                    answer: 1,
                },
                {
                    question: "What is  true",
                    option1: "!false",
                    option2: "!0",
                    option3: "!null",
                    answer: 1,
                },
            ];

            break;
        case GAME_TYPE.RELIEF:
            questions = [
                {
                    question: "So do you like bread?",
                    options: ["Yemen", "Paris", "No where"],
                    answer: 1,
                },
                {
                    question: "Where is courage the cowerdly dog",
                    options: ["Yemen", "Paris", "No where"],
                    answer: 1,
                },
                {
                    question: "What is  true",
                    options: ["Yemen", "Paris", "No where"],
                    answer: 1,
                },
            ];

            break;
        case GAME_TYPE.HEALTHCARE:
            questions = [
                {
                    question: "So do you like bread?",
                    option1: "Yemen",
                    option2: "Paris",
                    option3: "No where",
                    answer: 1,
                },
                {
                    question: "Where is courage the cowerdly dog",
                    option1: "Yemen",
                    option2: "Paris",
                    option3: "No where",
                    answer: 1,
                },
                {
                    question: "What is  true",
                    option1: "!false",
                    option2: "!0",
                    option3: "!null",
                    answer: 1,
                },
            ];
            break;
        default:
            questions = [
                {
                    question: "So do you like bread?",
                    option1: "Yemen",
                    option2: "Paris",
                    option3: "No where",
                    answer: 1,
                },
                {
                    question: "Where is courage the cowerdly dog",
                    option1: "Yemen",
                    option2: "Paris",
                    option3: "No where",
                    answer: 1,
                },
                {
                    question: "What is  true",
                    option1: "!false",
                    option2: "!0",
                    option3: "!null",
                    answer: 1,
                },
            ];

            break;
    }
    return {
        facts: questions,
    };
}
