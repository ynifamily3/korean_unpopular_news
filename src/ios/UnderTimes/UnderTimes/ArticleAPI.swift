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

class ArticleAPI{
    
    static func callArticle(_ completion:@escaping ([ArticleVO]?)->Void){
        let param :Parameters = [
            "query":"{newsArticles(start: \"2020-05-31\", include_keywords:[\"주택\"], exclude_keywords: [\"5호선\",\"국토\", \"주거\"]) { \n id \n title \n url \n img \n keywords { \n value \n } \n }}"
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
            
            
            /*
            .responseString { (response) in
            print(response)
            print(response.result)
            print(response.data)
            print(response.description)
        }*/
        
    }
}
