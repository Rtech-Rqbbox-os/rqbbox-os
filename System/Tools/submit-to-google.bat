@echo off
echo === RQBBOX OS — Submit to Google Search ===
echo.
echo This will open pages in your browser to submit RQBBOX OS to search engines.
echo You need to sign in to Google/Bing to complete submission.
echo.
pause
echo.
echo Opening Google Search Console...
start "" "https://search.google.com/search-console?resource_id=https://rtech-rqbbox-os.github.io/rqbbox-os/"
echo.
echo Opening Google Rich Results Test...
start "" "https://search.google.com/test/rich-results?url=https://rtech-rqbbox-os.github.io/rqbbox-os/website/os-info-card.html"
echo.
echo Opening Bing Webmaster Tools...
start "" "https://www.bing.com/webmasters/"
echo.
echo Done! Follow the instructions in each page to submit your sitemap.
echo Sitemap URL: https://rtech-rqbbox-os.github.io/rqbbox-os/sitemap.xml
echo.
pause
