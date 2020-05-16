//
//  CategoryView.swift
//  UnderTimes
//
//  Created by Andrew Han on 2020/05/16.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import SwiftUI

struct CategoryView:View{
    
    var body: some View{
        VStack{
            Image("image5")
                .resizable()
                .frame(width: 80, height: 80)
                .cornerRadius(12)
            Text("카테고리")
                .font(.subheadline)
                .fontWeight(.bold)
        }
    }
}
