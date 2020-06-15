//
//  ArticleAPI.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/06/02.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import Foundation
import Alamofire
import ObjectMapper
import Apollo
import AlamofireObjectMapper
class VariableVO{
    
}
enum CategoryVO:String {
    case POLITICS
    case ECONOMY
    case SOCIAL
    case LIFE
    case WORLD
    case SCIENCE
}
class KeywordAPI{
    static func searchKeyword(value:String, _ completion:@escaping ([KeywordVO]?)->Void){
        var queryString = "{keywords(value: \"\(value)\""
        queryString = queryString + ") { \n value \n weight \n createdAt \n }}"
        let param :Parameters = [
            "query":queryString
        ]
        Alamofire.request("https://undertimes.alien.moe/graphql", method: .post, parameters: param, encoding: JSONEncoding.default, headers: ["Content-Type":"application/json"]).responseObject { (response:DataResponse<DataKeywordVO>) in
            switch response.result{
            case .success(let value):
               if let receivedKeyWord = value.data{
                    if let keywords = receivedKeyWord.keywords{
                        completion(keywords)
                    }else{completion(nil)}
                }else{completion(nil)}
            case .failure(let error):
                completion(nil)
                print(error)
            }
        }
    }
    
}

class ArticleAPI{
    
    static func callArticle( lastId:Int?,limit:Int?, category:String?, includKeywords:[String]?,  excludeKeywords:[String]?, _ completion:@escaping ([ArticleVO]?)->Void){
        var formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "ko_KR")
        var current_date = formatter.string(from: Date())
        
        var queryString = "{newsArticles(start: \"\(current_date)\""
        if category != nil {
            queryString = queryString + ", category : \(category!)"
        }
        if limit != nil {
            queryString = queryString + ", limit : \(limit!)"
        }
        if lastId != nil {
            queryString = queryString + ", offset : \(lastId!)"
        }
        if includKeywords != nil {
            queryString = queryString + ", include_keywords : ["
            for row in includKeywords!{
                queryString = queryString + "\"\(row)\""
            }
            queryString = queryString + "]"
        }
        if excludeKeywords != nil {
            queryString = queryString + ", exclude_keywords : ["
            for row in excludeKeywords!{
                queryString = queryString + "\"\(row)\""
            }
            queryString = queryString + "]"
        }
        queryString = queryString + ") { \n id \n title \n url \n img \n keywords { \n value \n } \n }}"
        let param :Parameters = [
            "query":queryString
        ]
        Alamofire.request("https://undertimes.alien.moe/graphql", method: .post, parameters: param, encoding: JSONEncoding.default, headers: ["Content-Type":"application/json"]).responseObject { (response:DataResponse<DataVO>) in
            switch response.result{
            case .success(let value):
                if let newArticle = value.data{
                    if let articles = newArticle.newsArticles{
                        completion(articles)
                    }else{completion(nil)}
                }else{completion(nil)}
            case .failure(let error):
                completion(nil)
                print(error)
            }
        }
    }
}
