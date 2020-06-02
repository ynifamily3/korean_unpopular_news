//
//  ArticleModel.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/06/02.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import Foundation
import ObjectMapper

class ArticleVO : Mappable{
    var limit:Int?
    var title:String?
    var url:String?
    var img:String?
    var createdAt:String?
    var keywords:[KeywordVO]?
    var category:String?
    required init?(map: Map) {
        
    }
    func mapping(map: Map) {
        limit <- map["limit"]
        title <- map["title"]
        url <- map["url"]
        img <- map["img"]
        createdAt <- map["createdAt"]
        keywords <- map["keywords"]
        category <- map["category"]
        
    }
}

class KeywordVO:Mappable{
    var value:String?
    var weight:Float?
    required init?(map: Map) {
        
    }
    func mapping(map: Map) {
        value <- map["value"]
        weight <- map["weight"]
    }
}
