//
//  Network.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/30.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import Foundation
import Apollo

class URLManager {
    static var baseURL : URL? = URL(string: baseURLStr)
    static var baseURLStr = "https://undertimes.alien.moe/graphql"
}


class Network {
  static let shared = Network()
    
  private(set) lazy var apollo = ApolloClient(url: URL(string: "https://undertimes.alien.moe/graphql")!)
    
    
}
