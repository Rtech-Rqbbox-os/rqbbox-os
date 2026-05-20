/**
 * RQBBOX OS USB Launcher — iOS (Swift / WKWebView)
 * ─────────────────────────────────────────────
 * Opens RQBBOX OS full-screen when USB is connected.
 * Min iOS: 15.0
 *
 * App URL: https://inquisitive-rqbbox-core-play.base44.app
 * GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
 * RTech    — GOTECH AI
 */

import UIKit
import WebKit

class RQBBOXUSBLauncher: UIViewController, WKNavigationDelegate, WKUIDelegate {

    private let appURL = URL(string: "https://inquisitive-rqbbox-core-play.base44.app")!
    private var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 10/255, green: 10/255, blue: 10/255, alpha: 1)
        setupWebView()
        loadApp()
    }

    override var prefersStatusBarHidden: Bool { return true }
    override var prefersHomeIndicatorAutoHidden: Bool { return true }

    private func setupWebView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        // Persistent data store
        config.websiteDataStore = WKWebsiteDataStore.default()

        // Preferences
        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true
        config.defaultWebpagePreferences = prefs

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.scrollView.bounces = false
        webView.isOpaque = false
        webView.backgroundColor = .clear

        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
    }

    private func loadApp() {
        let request = URLRequest(url: appURL, cachePolicy: .returnCacheDataElseLoad)
        webView.load(request)
    }

    // Reload on error
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
            self?.loadApp()
        }
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
            self?.loadApp()
        }
    }
}
