<?php
/**
 * Plugin Name: RQBBOX OS Info Card
 * Plugin URI: https://rtech-rqbbox-os.github.io/rqbbox-os/System/Platforms/wordpress/
 * Description: Embed the RQBBOX OS information card anywhere with a shortcode. Shows OS features, editions, download links.
 * Version: 1.2.0
 * Author: RhysTech
 * Author URI: https://github.com/Rtech-Rqbbox-os
 * License: MIT
 * Text Domain: rqbbox-os
 */

defined('ABSPATH') or die('Direct access denied');

define('RQBBOX_OS_VERSION', '1.2.0');
define('RQBBOX_OS_URL', 'https://rtech-rqbbox-os.github.io/rqbbox-os');
define('RQBBOX_OS_CARD_URL', RQBBOX_OS_URL . '/System/Website/os-info-card.html');
define('RQBBOX_OS_DOWNLOAD', 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases');
define('RQBBOX_OS_REPO', 'https://github.com/Rtech-Rqbbox-os/rqbbox-os');

// Shortcode: [rqbbox_os_card]
function rqbbox_os_card_shortcode($atts) {
    $atts = shortcode_atts(['style' => 'dark', 'compact' => 'false'], $atts);
    $compact = filter_var($atts['compact'], FILTER_VALIDATE_BOOLEAN);

    $html = '<div class="rqbbox-os-card" style="background:rgba(20,22,28,.95);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#fff;margin:20px 0;box-shadow:0 20px 60px rgba(0,0,0,.6);max-width:100%">';

    $html .= '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">';
    $html .= '<svg width="48" height="48" viewBox="0 0 100 100" style="flex-shrink:0"><rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#rqb-g)" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-size="52" font-weight="800" fill="url(#rqb-g)" font-family="Segoe UI">R</text><defs><linearGradient id="rqb-g"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#9d4edd"/></linearGradient></defs></svg>';
    $html .= '<div><div style="font-size:1.2rem;font-weight:700">RQBBOX OS</div><div style="font-size:.75rem;color:rgba(255,255,255,.4)">Portable USB Gaming OS by RhysTech</div></div></div>';

    $html .= '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">';
    foreach (['v' . RQBBOX_OS_VERSION, 'Open Source', 'Free', 'PS5 UI'] as $tag) {
        $html .= '<span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:.65rem;color:#00d4ff;text-transform:uppercase">' . esc_html($tag) . '</span>';
    }
    $html .= '</div>';

    if (!$compact) {
        $html .= '<div style="font-size:.82rem;line-height:1.6;color:rgba(255,255,255,.55);margin-bottom:14px">A portable USB-based gaming OS that runs entirely from a USB drive without installation. PS5-inspired UI, pro audio engine, 43+ store packages, phone bootloader. Works on Windows, macOS, Linux, Android, iOS, and KaiOS.</div>';

        $features = [
            ['🎮', '6 Games', 'HTML5 native titles'],
            ['🛒', '43+ Packages', 'Store + Google Play'],
            ['🎨', 'PS5 UI', 'Dark minimal, glassmorphism'],
            ['🔊', 'Pro Audio', '40+ synth sounds, DSP'],
            ['📱', 'Phone Boot', 'Auto-detect + PWA'],
            ['👤', 'Multi-User', 'Auth, cloud sync'],
        ];
        $html .= '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:14px">';
        foreach ($features as $f) {
            $html .= '<div style="padding:6px 8px;border-radius:6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);font-size:.7rem;color:rgba(255,255,255,.5)"><strong style="color:rgba(255,255,255,.7)">' . esc_html($f[0]) . ' ' . esc_html($f[1]) . '</strong> &bull; ' . esc_html($f[2]) . '</div>';
        }
        $html .= '</div>';
    }

    $html .= '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    $html .= '<a href="' . esc_url(RQBBOX_OS_DOWNLOAD) . '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.78rem;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.2)">⬇ Download</a>';
    $html .= '<a href="' . esc_url(RQBBOX_OS_REPO) . '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.78rem;font-weight:600;text-decoration:none;background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">GitHub</a>';
    $html .= '<a href="' . esc_url(RQBBOX_OS_CARD_URL) . '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.78rem;font-weight:600;text-decoration:none;background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">Info Card</a>';
    $html .= '</div>';

    $html .= '<div style="padding-top:10px;border-top:1px solid rgba(255,255,255,.04);font-size:.65rem;color:rgba(255,255,255,.25);display:flex;justify-content:space-between;flex-wrap:wrap;margin-top:14px"><span>&copy; 2026 RhysTech &bull; MIT</span><span style="display:flex;gap:8px"><a href="https://www.youtube.com/@RQBBOX-REAL" style="color:rgba(0,212,255,.4);text-decoration:none">YouTube</a><a href="mailto:rqbbox.support@groups.outlook.com" style="color:rgba(0,212,255,.4);text-decoration:none">Support</a></span></div>';

    $html .= '</div>';
    return $html;
}
add_shortcode('rqbbox_os_card', 'rqbbox_os_card_shortcode');

// Widget
class RQBBOX_OS_Card_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct('rqbbox_os_card', 'RQBBOX OS Info Card', ['description' => 'Display the RQBBOX OS info card']);
    }
    public function widget($args, $instance) {
        echo $args['before_widget'];
        echo rqbbox_os_card_shortcode(['compact' => $instance['compact'] ?? 'false']);
        echo $args['after_widget'];
    }
    public function form($instance) {
        $compact = $instance['compact'] ?? 'false';
        echo '<p><label><input type="checkbox" ' . checked('true', $compact, false) . ' name="' . $this->get_field_name('compact') . '" value="true"> Compact mode</label></p>';
    }
    public function update($new, $old) {
        return ['compact' => isset($new['compact']) ? 'true' : 'false'];
    }
}
add_action('widgets_init', function() { register_widget('RQBBOX_OS_Card_Widget'); });

// Gutenberg block
add_action('enqueue_block_editor_assets', function() {
    wp_add_inline_script('wp-blocks', '
        wp.blocks.registerBlockType("rqbbox-os/info-card", {
            title: "RQBBOX OS Info Card",
            icon: "dashboard",
            category: "embed",
            attributes: { compact: { type: "boolean", default: false } },
            edit: function(props) {
                return wp.element.createElement("div", {
                    style: {
                        background: "rgba(20,22,28,.95)",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "16px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
                        textAlign: "center"
                    }
                }, wp.element.createElement("div", { style: { fontSize: "1.2rem", fontWeight: 700 } }, "🎮 RQBBOX OS Info Card"), wp.element.createElement("div", { style: { fontSize: ".8rem", color: "rgba(255,255,255,.4)", marginTop: 4 } }, "Click Preview to see the card"), props.attributes.compact ? " (compact)" : "");
            },
            save: function() { return null; }
        });
    ');
});

// TinyMCE button
add_action('init', function() {
    if (current_user_can('edit_posts')) {
        add_filter('mce_buttons', function($buttons) { $buttons[] = 'rqbbox_os'; return $buttons; });
        add_filter('mce_external_plugins', function($plugins) {
            $plugins['rqbbox_os'] = 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Platforms/wordpress/tinymce.js';
            return $plugins;
        });
    }
});

// Auto-include CSS on posts/pages with the shortcode
add_action('wp_enqueue_scripts', function() {
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'rqbbox_os_card')) {
        echo '<style>.rqbbox-os-card a:hover{opacity:.85}</style>';
    }
});
