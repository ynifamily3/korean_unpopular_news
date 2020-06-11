//
//  ArticleView.swift
//  Undertimes
//
//  Created by Andrew Han on 2020/05/11.
//  Copyright © 2020 escapeanaemia. All rights reserved.
//

import Foundation
import SwiftUI
import SafariServices
import SDWebImageSwiftUI
struct ArticleTextView:View{
    let article:ArticleVO
    var body: some View{
        VStack(alignment: .center, spacing: 0) {
            
            Rectangle()
//            .fill()
//            Text(article.title ?? "").lineLimit(2).font(.body)
//            .background(ColorList.mainColor)
//            .foregroundColor(.white)
        }.background(Color.black)
        .padding(0)
        
    }
}


struct ArticleView: View {
    @State var showingSheet = false
    @State var frame:CGSize = .zero
    
    let article :ArticleVO
    var body: some View{
        VStack(alignment: .leading, spacing: 10) {
            WebImage(url: URL(string: article.img ?? ""))
            .resizable()  // creates resizable image
            .aspectRatio(contentMode: .fit)
            

            Text(article.title ?? "").lineLimit(2).font(.body)
                .background(Color.white)
            .foregroundColor(.black)
                .frame(minWidth: 0, maxWidth: .infinity, idealHeight: nil, maxHeight: nil, alignment: .bottom)
            
        }
        .onTapGesture {
            print("클릭됨 - \(self.article.title) ")
            if let url = URL(string: self.article.url ?? ""){
                UIApplication.shared.open(url)
            }
        }
        .background(Color.white)
        
        .border(Color.gray, width: 1)
        .cornerRadius(10)
         .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.gray, lineWidth: 1)
            )
    }

}

struct FullButtonView:View{
    @State var showSafari = false
    @State var urlString = "https://duckduckgo.com"
    var body: some View{
        Button(action: {
            
        }){
            Text("asfadsfads")
        }
    .sheet(isPresented: $showSafari) {
        SafariView(url:URL(string: self.urlString)!)
    }
    }
}
struct SafariView: UIViewControllerRepresentable {

    let url: URL

    func makeUIViewController(context: UIViewControllerRepresentableContext<SafariView>) -> SFSafariViewController {
        return SFSafariViewController(url: url)
    }

    func updateUIViewController(_ uiViewController: SFSafariViewController, context: UIViewControllerRepresentableContext<SafariView>) {

    }

}

struct NewsView:View{
    @ObservedObject var webViewStore = WebViewStore()
    
    var body: some View {
      NavigationView {
        WebView(webView: webViewStore.webView)
          .navigationBarTitle(Text(verbatim: webViewStore.webView.title ?? ""), displayMode: .inline)
          .navigationBarItems(trailing: HStack {
            Button(action: goBack) {
              Image(systemName: "chevron.left")
                .imageScale(.large)
                .aspectRatio(contentMode: .fit)
                .frame(width: 32, height: 32)
            }.disabled(!webViewStore.webView.canGoBack)
            Button(action: goForward) {
              Image(systemName: "chevron.right")
                .imageScale(.large)
                .aspectRatio(contentMode: .fit)
                .frame(width: 32, height: 32)
            }.disabled(!webViewStore.webView.canGoForward)
          })
        
    
      }.onAppear {
        self.webViewStore.webView.load(URLRequest(url: URL(string: "https://apple.com")!))
      }
    }
    
    func goBack() {
      webViewStore.webView.goBack()
    }
    
    func goForward() {
      webViewStore.webView.goForward()
    }
}
