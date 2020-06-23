//
//  ContentView.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI
import UIKit

class KeywordObserver : ObservableObject{
    @Published var keywords = Array<KeywordVO>()
}

class ArticleObserver : ObservableObject{
    @Published var articles = Array<ArticleVO>()
}
struct ModalView: View {
    @Binding var presentedAsModal: Bool
    let cars = ["Subaru WRX", "Tesla Model 3", "Porsche 911", "Renault Zoe", "DeLorean"]
    @State private var searchText : String = ""
    var body: some View {
        NavigationView {
            VStack {
                Button("dismiss") { self.presentedAsModal = false }
//                SearchBar(text: $searchText)
//                List {
//                    ForEach(self.cars.filter {
//                        self.searchText.isEmpty ? true : $0.contains(self.searchText)
//                    }, id: \.self) { car in
//                        Text(car)
//                    }
//                }.navigationBarTitle(Text("Cars"))
            }
        }
        
    }
}

struct ContentView: View {
    let cars = ["Subaru WRX", "Tesla Model 3", "Porsche 911", "Renault Zoe", "DeLorean"]
    @State private var searchText : String = ""
    @State private var keywordList = Array<KeywordVO>()
    @State var presentingModal = false
    @EnvironmentObject var keywords : KeywordObserver
    @EnvironmentObject var articles : ArticleObserver
//    @State var articles = Array<ArticleVO>()
    @State var category = ["목록1","목록2","목록3","목록4"]

    init(){
        UITableView.appearance().separatorColor = .clear
    }
    var body: some View {
        
        NavigationView{
            VStack{
                List{
                    ScrollView(.horizontal, showsIndicators: false){
                        HStack{
                            CategoryView(title: "홈",tag: 0, imageStr: "image5")
                            CategoryView(title: "정치",tag: 1, imageStr: "image5")
                            CategoryView(title: "경제",tag: 2, imageStr: "image5")
                            CategoryView(title: "사회",tag: 3, imageStr: "image5")
                            CategoryView(title: "IT/과학",tag: 4, imageStr: "image5")
                            CategoryView(title: "생활/문화",tag: 5, imageStr: "image5")
                            CategoryView(title: "세계",tag: 6, imageStr: "image5")
                        }
                    }
//                    Button("검색조건 추가하기") { self.presentingModal = true }
//                    .sheet(isPresented: $presentingModal) { ModalView(presentedAsModal: self.$presentingModal) }
                    SearchBar(text: $searchText, keywords: $keywords.keywords, articles: $articles.articles)
                    
                    ForEach(articles.articles) { article in
                        ArticleView(article: article)
                        .padding(16)
                        .padding(.top, 8)
                        .padding(.bottom, 8)
                    }
                }
            }
            .padding(.leading, -20)
            .padding(.trailing, -20) 
            .navigationBarTitle(Text("Undertimes"))

        }.onAppear{
            ArticleAPI.callArticle(lastId: nil, limit: 30, category: nil,includKeywords: nil, excludeKeywords: nil) { responseArticles in
                print(responseArticles)
                guard responseArticles != nil else { return }
                self.articles.articles = responseArticles!
                
            }
        }
    .background(Color(UIColor(red: 249/255, green: 247/255, blue: 240/255, alpha: 1)))
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
