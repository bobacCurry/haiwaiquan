import { copyText } from '@/libs/util'

const AvailableNetworks = {
	telegram: 'https://t.me/share/url?url=@u&text=@t',
	whatsapp: 'https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d',
	line: 'http://line.me/R/msg/text/?@t%0D%0A@u%0D%0A@d',
	facebook: 'https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h',
}

export const shareLink = (net,url,title,description) => {

	if (net==='link') {

		return copyText(url)
	}

	if (!AvailableNetworks[net]) {

		return
	}

	const link = AvailableNetworks[net].replace(/@u/g, encodeURIComponent(url)).replace(/@t/g, encodeURIComponent(title)).replace(/@d/g, encodeURIComponent(description))

	window.open(link,'_blank')
}