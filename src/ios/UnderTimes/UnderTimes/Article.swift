//
//  Article.swift
//  Undertimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI

/// Post
struct Article: Identifiable {
    
    var id: String = UUID().uuidString
    let image: String?
    let content: String?
    let time: String!
    init(id:Int?, image: String?, content: String?, time: String) {
        //MARK:- 아이디를 스트링 타입으로 받고 있는데 int 타입으로 수정해야함
        //self.id = id
        self.image = image
        self.content = content
        self.time = time
    }
}

