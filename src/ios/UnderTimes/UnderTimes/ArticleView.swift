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
    @State var showingSheet = false
    let article :ArticleVO
    var body: some View{
        VStack(alignment: .leading, spacing: 10) {
            WebImage(url: URL(string: article.img ?? ""))
            .resizable()  // creates resizable image
            .overlay(ArticleTextView(article: article),alignment: .bottom)
            .aspectRatio(3/2, contentMode: .fit)
            /*
            Image( "image4")
            .resizable()  // creates resizable image
            .overlay(ArticleTextView(article: article),alignment: .bottom)
            .aspectRatio(3/2, contentMode: .fit)*/
            
        }
        .onTapGesture {
            print("클릭됨 - \(self.article.title) ")
            if let url = URL(string: self.article.url ?? ""){
                UIApplication.shared.open(url)
            }
            
            
        }
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
