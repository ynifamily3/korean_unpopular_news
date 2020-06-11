//
//  CategoryView.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/16.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI

class ColorList {
    static var mainUIColor = UIColor(red: 48/255, green: 69/255, blue: 182/255, alpha: 1)
    static var mainColor = Color(mainUIColor)
}

struct CategoryView:View{
    @EnvironmentObject var articles : ArticleObserver
    var title:String = ""
    var tag : Int = 0
    var imageStr:String = "image5"
    var body: some View{
        VStack{
            Button(action: {
                var cat :String?
                switch self.tag{
                case 0:
                    cat = nil
                case 1:
                    cat = CategoryVO.POLITICS.rawValue
                case 2:
                    cat = CategoryVO.ECONOMY.rawValue
                case 3:
                    cat = CategoryVO.SOCIAL.rawValue
                case 4:
                    cat = CategoryVO.SCIENCE.rawValue
                case 5:
                    cat = CategoryVO.LIFE.rawValue
                case 6:
                    cat = CategoryVO.WORLD.rawValue
                default:
                    print("error")
                }
                
                ArticleAPI.callArticle(lastId: nil, limit: 10, category: cat, includKeywords: nil, excludeKeywords: nil) { (articles) in
                    if articles != nil{
                        self.articles.articles = articles!
                    }
                }
            }) {
                Text(title)
                    .fontWeight(.bold)
                    .font(.body)
                    .padding()
                    .background(ColorList.mainColor)
                    .cornerRadius(40)
                    .foregroundColor(.white)
                    .padding(0)
                    .overlay(
                        RoundedRectangle(cornerRadius: 40)
                            .stroke(ColorList.mainColor, lineWidth: 1)
                    )
            }
        
            /*
            Image(imageStr)
                .resizable()
                .frame(width: 80, height: 80)
                .cornerRadius(12)
            Text(title)
                .font(.subheadline)
                .fontWeight(.bold)
 */
        }
        .padding(.top, 4)
        .padding(.bottom, 4)
    }
}
