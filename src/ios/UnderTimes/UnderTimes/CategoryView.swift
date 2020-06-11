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
    var title:String = ""
    var imageStr:String = "image5"
    var body: some View{
        VStack{
            Button(action: {
                print("Hello button tapped!")
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
