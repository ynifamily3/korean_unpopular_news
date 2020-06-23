//
//  SearchVar.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/06/16.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import Foundation
import SwiftUI


struct SearchBar: UIViewRepresentable {

    @Binding var text: String

    @Binding var keywords:[KeywordVO]
    @Binding var articles:[ArticleVO]
    class Coordinator: NSObject, UISearchBarDelegate {

        @Binding var text: String
        @Binding var keywords :[KeywordVO]
        @Binding var articles:[ArticleVO]
        init(text: Binding<String>, keywords : Binding<[KeywordVO]>, articles : Binding<[ArticleVO]>) {
            _text = text
            _keywords = keywords
            _articles = articles
        }

        func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
            text = searchText
            keywords = Array<KeywordVO>()
//            KeywordAPI.searchKeyword(value: searchText) { (keywordsResult) in
//                self.keywords = keywordsResult!
//            }
           
                
            
        }
        
        func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
            if let searchText = searchBar.text{
                DispatchQueue.main.async {
                    ArticleAPI.callArticle(lastId: nil, limit: 30, category: nil, includKeywords: [searchText], excludeKeywords: nil) { (responseArticles) in
                        guard responseArticles != nil else { return }
                        self.articles = responseArticles!
                    }
                }
            }
        }
        
    }

    func makeCoordinator() -> SearchBar.Coordinator {
        return Coordinator(text: $text, keywords: $keywords, articles: $articles)
    }

    func makeUIView(context: UIViewRepresentableContext<SearchBar>) -> UISearchBar {
        let searchBar = UISearchBar(frame: .zero)
        searchBar.delegate = context.coordinator
        searchBar.searchBarStyle = .minimal
        return searchBar
    }

    func updateUIView(_ uiView: UISearchBar, context: UIViewRepresentableContext<SearchBar>) {
        uiView.text = text
    }
}
