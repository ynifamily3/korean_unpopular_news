//
//  DummyData.swift
//  Undertimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

struct TestData {

    static func articles() -> [Article] {
        let article1 = Article(id: nil, image: "image1", content: "코로나19의 여파로 서울시는 마스크를 착용하지 않은 사람에 한해 지하철 입장을 금지하는 명령을 실행하였습니다. 앞으로 혼잡도가 150%가 넘은 상황에서 마스크를 착용하지 않으면 ", time: "10분전")
        let article2 = Article(id: nil, image: "image2", content: "강남, 홍대 등 사람 밀집 지하철 역에서 다음달 부터 안전요원이 배치될 전망입니다. 마스크 착용 여부를 검사하고 마스크를 착용하지 않을 경우 지하철 입장을 거부할 수 있습니다.", time: "1시간")
        let article3 = Article(id: nil, image: "image3", content: "Intel에서 새로운 CPU를 출시할 예정이라고 밝혔습니다. 해당 CPU는 머신러닝에 최적화 되어있으며 전 모델 대비 130프로의 성능을 낼 것으로 기대된다고 합니다.", time: "하루전")
        let article4 = Article(id: nil, image: "image4", content: "", time: "한달전")
        let article5 = Article(id: nil, image: "image5", content: "", time: "한달전")
        return [article1, article2, article3, article4,article5]
    }
}
