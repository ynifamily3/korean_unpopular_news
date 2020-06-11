//
//  ContentView.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI
import UIKit
struct ContentView: View {

    @State var articles = Array<ArticleVO>()
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
                            CategoryView(title: "홈", imageStr: "image5")
                            CategoryView(title: "정치", imageStr: "image5")
                            CategoryView(title: "경제", imageStr: "image5")
                            CategoryView(title: "사회", imageStr: "image5")
                            CategoryView(title: "IT/과학", imageStr: "image5")
                            CategoryView(title: "생활/문화", imageStr: "image5")
                            CategoryView(title: "세계", imageStr: "image5")
                        }
                    }
                    ForEach(articles) { article in
                        ArticleView(article: article)
                            .padding(.bottom, 16)
                        

                    }
                }
            }
            
            
            .padding(.leading, -20)
            .padding(.trailing, -20) 
            .navigationBarTitle(Text("Articles"))

        }.onAppear{
            ArticleAPI.callArticle { responseArticles in
                print(responseArticles)
                guard responseArticles != nil else { return }
                self.articles = responseArticles!
                
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
