/* Product registry dengan auto-loader untuk semua gambar dari folder */

async function loadProductsFromFolder(folder){
	try{
		const res = await fetch(folder, {cache:'no-store'});
		if(!res.ok) return [];
		const html = await res.text();
		const re = /href="([^"]+\.(?:png|jpg|jpeg|gif|webp))"/ig;
		const files = [];
		let m;
		while((m=re.exec(html))!==null){
			let f = m[1];
			if(!f.startsWith('http') && !f.startsWith('/')) f = folder.replace(/\/+$/,'') + '/' + f;
			files.push(f);
		}
		return files.map(f => ({
			name: f.split('/').pop().replace(/\.[^/.]+$/,'').replace(/[_\-\d]/g,' ').trim(),
			img: f
		}));
	}catch(e){
		console.warn('Folder load error:', folder, e);
		return [];
	}
}

const categoryRegistry = {
	'Sirup': [],
	'Salep': [],
	'Tablet': [],
	'Injeksi': [],
	'Infus': [],
	'Obat Tetes': [],
	'Diffuser': [],
	'Nasal Spray': []
};

const folderMap = {
	'Sirup': ['img/Sirup-20251209T022312Z-3-001/', 'img/Sirup/'],
	'Salep': ['img/Sale[/', 'img/Sale%5B/', 'img/Salep/'],
	'Tablet': ['img/Tablet/', 'img/Tablet%20/'],
	'Injeksi': ['img/Injeksi-20251209T043404Z-3-001/', 'img/Injeksi/'],
	'Infus': ['img/Infus (10)-20251209T043831Z-3-001/Infus (10)/', 'img/Infus%20(10)-20251209T043831Z-3-001/Infus%20(10)/'],
	'Obat Tetes': ['img/Obat tetes-20251209T043807Z-3-001/', 'img/Obat%20tetes-20251209T043807Z-3-001/'],
	'Diffuser': ['img/Diffuser (8)-20251209T043833Z-3-001/', 'img/Diffuser%20(8)-20251209T043833Z-3-001/'],
	'Nasal Spray': ['img/Nasal Spray (5)-20251209T052342Z-3-001/', 'img/Nasal%20Spray%20(5)-20251209T052342Z-3-001/']
};

async function loadAllProducts(){
	for(const cat in folderMap){
		const folders = folderMap[cat];
		for(const folder of folders){
			const products = await loadProductsFromFolder(folder);
			if(products.length){
				categoryRegistry[cat] = products;
				console.info(`Loaded ${products.length} products for ${cat} from ${folder}`);
				break;
			}
		}
	}
}

// auto-load semua produk saat script dimuat
loadAllProducts().then(()=>{
	console.info('All products loaded successfully');
	// trigger re-render jika function sudah tersedia
	if(window.renderCategoryCards && typeof window.renderCategoryCards === 'function'){
		window.renderCategoryCards();
	}
}).catch(err => console.warn('Product load error:', err));
