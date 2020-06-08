//
//  ArticleView.swift
//  Undertimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import Foundation
import SwiftUI

struct ArticleTextView:View{
    let article:ArticleVO
    var body: some View{
        VStack(alignment: .leading, spacing: 0) {
            Text(article.title ?? "").lineLimit(2).font(.body)
                .padding(.leading, 16)
                .padding(.trailing, 16)
                .padding(.bottom, 8)
                .padding(.top, 8)
                .background(Color.black.opacity(0.3))
        }
    }
}

struct ArticleView: View {
    let article :ArticleVO
    var body: some View{
        VStack(alignment: .leading, spacing: 10) {
            Image( "image4")
            .resizable()  // creates resizable image
            .overlay(ArticleTextView(article: article),alignment: .bottom)
            .aspectRatio(3/2, contentMode: .fit)
        }
        .onTapGesture {
            print("클릭됨 - \(self.article.title) ")
            ContentView()
        }
    
    
    }

}


