import { KMR } from "koalanlp/API";
import { Tagger } from "koalanlp/proc";
import TextRank, { Word } from "../TextRank";
import express from "express";

export default async function api(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const tagger = new Tagger(KMR);
  const tagged = await tagger(
    `
    대법원이 상반기 대형 공공 정보기술(IT) 사업 가운데 하나인 미래등기시스템 구축사업 규모를 기존 공고때보다 200억원 이상 대폭 줄어든 금액으로 발주했다. 사업 금액은 줄었는데 과업은 첫 공고때와 크게 다르지 않아 사업을 수주할 경우 업계 적자가 불가피할 전망이다.
    대법원은 미래등기시스템 구축 사업 제안요청서(RFP)를 조달청 나라장터에 공고했다.
    
    미래등기시스템 구축 사업은 당초 지난달 발주났다가 입찰 마감 사흘 전 갑자기 '입찰취소공고'를 내는 등 논란을 일으켰다. 당시 대법원은 “구축기간이 5년 장기수행과제로 2021년부터 2024년까지 연차별 투입 예산이 미확정 상황으로 장기계속계약 불안정 요소인 총 구축비를 확정하기 위해 입찰공고를 취소했다”고 밝혔다.
    
    대법원이 취소 한 달 만에 다시 사업을 발주했지만 업계 혼란만 가중시켰다.
    
    우선 대법원은 사업 예산을 200억원 가량 삭감했다. 지난달 1차 공고 시 사업 금액(예정)은 2020년부터 2024년까지 897억원이었다. 그런데 한 달만에 사업 금액을 200억원 이상 줄인 623억원에 발주했다.
    
    예산 금액은 줄었는데 과업 범위는 이전과 비슷한 수준이다. 업계 관계자는 “세부적으로 살펴봐야겠지만 지난달 처음 공고했던 과업 범위와 큰 차이가 없다”면서 “한 달만에 갑자기 200억원 이상 예산을 줄여 발주난 것도 이해하기 어렵고, 이 금액으로 과업을 진행하기는 어렵다”고 전했다.
    미래등기시스템 구축 사업은 노후화된 시스템을 재구축하고 국가등기체계 개편 기반을 마련하는 사업이다. 단순 시스템 추가가 아니라 시스템 전체를 개편하는 대형 사업이다. 이번 사업에 참여하기 위해 중소 SW·IT서비스 업계가 몇 개월간 인력을 투입해 준비했다.
업계 관계자는 “민간에서는 예산이 줄어들 경우 그에 맞게 다시 과업을 줄이거나 조정해 발주한다”면서 “예산을 줄였는데 해야할 일 목록이 그대로라면 결국 200억원이 넘는 금액을 업계가 부담으로 떠안을 수 밖에 없는 것”이라고 호소했다.
업계는 올해 대형 공공 IT사업이 이어질 예정인 만큼 대법원이 모범 사례를 남겨야한다고 지적한다.
중소 SW 업체 대표는 “코로나19 여파로 민간 시장도 축소된 상황에서 공공이 조기 발주는커녕 예산을 삭감하고 과업 변경도 제대로 확인하지 않은채 발주한 상황에 참담함을 느낀다”면서 “과업변경과 제대로 된 예산 반영은 업계가 수 십년째 강조한 사안인데 대법원 사례를 이를 후퇴시키는 행태”라고 지적했다. 이어 “올해 SW 업계는 공공 시장에 많이 의지를 할 수밖에 없는 상황”이라면서 “대법원이 변경된 예산에 맞는 과업 조정 등 공공 SW 건전한 발주 문화를 만들어야 이후 공공 발주 사업도 이 분위기를 이어갈 것”이라고 강조했다.
`.replace(/\n/g, "")
  );
  const words: Word[] = [];
  const sents: Word[][] = [];
  for (const sent of tagged) {
    sents.push([]);
    for (const word of sent) {
      for (const mor of word) {
        sents[sents.length - 1].push({ surface: mor._surface, tag: mor._tag });
        words.push({ surface: mor._surface, tag: mor._tag });
      }
    }
  }
  // console.log(sents);
  const rank = new TextRank(2);
  rank.load(sents);
  rank.build();
  // res.send(rank.extractKeywords(words, 10));
  // res.send(rank.extract());
  res.send("hello");
}
