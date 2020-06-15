//
//  ContentView.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI
import UIKit

class ArticleObserver : ObservableObject{
    @Published var articles = Array<ArticleVO>()
}
struct ModalView: View {
    @Binding var presentedAsModal: Bool
    var body: some View {
        
        Button("dismiss") { self.presentedAsModal = false }
    }
}

struct ContentView: View {
    @State var presentingModal = false
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
                    Button("검색조건 추가하기") { self.presentingModal = true }
                    .sheet(isPresented: $presentingModal) { ModalView(presentedAsModal: self.$presentingModal) }
                    ForEach(articles.articles) { article in
                        ArticleView(article: article)
//                            .padding(.bottom, 16)
                        .padding(16)
                        .padding(.top, 8)
                        .padding(.bottom, 8)
                    }
                }
            }
            
            
            .padding(.leading, -20)
            .padding(.trailing, -20) 
            .navigationBarTitle(Text("Articles"))

        }.onAppear{
            ArticleAPI.callArticle(lastId: nil, limit: 10, category: nil,includKeywords: nil, excludeKeywords: nil) { responseArticles in
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
