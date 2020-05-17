interface Keyword {
  value: string;
  weight: number;
}

export interface NewsArticle {
  title: string;
  category: string;
  keywords: Keyword[];
  url: string;
  createAt: string;
}

export const getNewsArticles = (keywords: string[]): NewsArticle[] => {
  return [
    {
      title: "'번호이동·고가요금·제휴카드사용' 충족못하면 '0원폰'없다",
      category: "105",
      createAt: new Date().toISOString(),
      keywords: [
        {
          value: "판매 장려금",
          weight: 1,
        },
        {
          value: "공짜 폰",
          weight: 1,
        },
        {
          value: "코로나 19",
          weight: 1,
        },
        {
          value: "20 시리즈",
          weight: 1,
        },
        {
          value: "단말 가격",
          weight: 1,
        },
      ],
      url:
        "https://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=105&oid=057&aid=0001455351",
    },
  ];
};
