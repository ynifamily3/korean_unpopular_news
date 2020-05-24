//
//  ContentView.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    let articles = TestData.articles()
    let category = ["목록1","목록2","목록3","목록4"]
    var body: some View {
        
        NavigationView{
            VStack{
                List{
                    ScrollView(.horizontal, showsIndicators: false){
                        HStack{
                            CategoryView()
                            CategoryView()
                            CategoryView()
                            CategoryView()
                            CategoryView()
                            CategoryView()
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

        }
    .background(Color(UIColor(red: 249/255, green: 247/255, blue: 240/255, alpha: 1)))
    }

}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
