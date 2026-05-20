import UIKit
import WebKit

/**
 * RQBBOX OS USB Launcher — iOS
 * Connects via USB-C Lightning and launches RQBBOX OS in full-screen WKWebView
 */
class ViewController: UIViewController, WKNavigationDelegate {

    var webView: WKWebView!
    let rqbboxURL = "https://app.base44.com/apps/6a0d64e743c742005c890c76"

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.04, alpha: 1.0)

        // Configure WKWebView
        let config = WKWebViewConfiguration()
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsInlineMediaPlayback = true

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.scrollView.bounces = false
        webView.scrollView.isScrollEnabled = true

        view.addSubview(webView)

        if let url = URL(string: rqbboxURL) {
            webView.load(URLRequest(url: url))
        }
    }

    override var prefersStatusBarHidden: Bool { return true }
    override var prefersHomeIndicatorAutoHidden: Bool { return true }
}
