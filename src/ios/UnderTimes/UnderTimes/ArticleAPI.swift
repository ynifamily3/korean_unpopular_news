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

class ArticleListGP : GraphQLQuery{
    typealias Data = GraphQLSelection
    
}

class ArticleAPI{
    
    static func callArticle(_ completion:@escaping (GraphQLResult<ArticleListGP.Data>?)->Void){
        Network.shared.apollo.fetch(query: ArticleListGP()) { result in
          switch result {
          case .success(let graphQLResult):
            print("Success! Result: \(graphQLResult)")
            completion(graphQLResult)
          case .failure(let error):
            print("Failure! Error: \(error)")
            completion(nil)
          }
        }

    }
}
