module.exports = function (locals) {
    var log = this.log;
    var config = this.config;
    var root_url = config.url
    var cdnUrlsFile = config.tencentcdn.path
    var push_type = {}
    var push_file = {}
    var push_urls = ""

    var isConfig = false

    config.deploy.forEach(element => {
        if (element["type"] === "tencent_cdn") {
            push_type = element["path"]
            push_file = element["file"]
            isConfig = true
        }
    });

    if (isConfig == false)
        return

    log.info("Generating Tencent CDN urls");

    if (push_type.includes("posts")) {
        var post_urls = [].concat(locals.posts.toArray())
            .map(function (post) {
                return post.permalink
            })
            .join('\n');

        push_urls += "\n" + post_urls
        log.info("Posts urls generated");
    }

    if (push_type.includes("pages")) {
        var page_urls = [].concat(locals.pages.toArray())
            .map(function (post) {
                text = post.permalink
                if (text.slice(text.length - 10, text.length) == "index.html") return post.permalink.slice(0, text.length - 10)
            })
            .join('\n')
            .replace(/(\n[\s\t]*\r*\n)/g, '\n')
            .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')

        push_urls += "\n" + page_urls
        log.info("Pages urls generated")
    }

    push_type.forEach(element => {
        if (element !== "posts" && element !== "pages") {
            var urls = [].concat(locals.pages.toArray())
                .map(function (post) {
                    if (post.permalink.slice(root_url.length, root_url.length + 1 + element.length + 1) == "/" + element + "/") {
                        // console.log(post.permalink)
                        return post.permalink
                    }
                })
                .join('\n')
                .replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')

            push_urls += "\n" + urls
            log.info(element + " urls generated")
        }
    });

    push_file.forEach(element => {
        push_urls += "\n" + root_url + "/" + element
    });
    log.info("file urls generated")

    push_urls += "\n" + root_url + "/"

    push_urls = push_urls.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')

    return {
        path: cdnUrlsFile, data: push_urls
    };
};