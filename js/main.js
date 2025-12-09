(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top shadow-sm');
        } else {
            $('.nav-bar').removeClass('sticky-top shadow-sm');
        }
    });


    // Hero Header carousel
    $(".header-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: false,
        loop: true,
        margin: 0,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // ProductList carousel
    $(".productList-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });

    // ProductList categories carousel
    $(".productImg-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        items: 1,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // Single Products carousel
    $(".single-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        dotsData: true,
        loop: true,
        items: 1,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // ProductList carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });


    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


   

})(jQuery);

// --- ADD TO CART FUNCTION ---
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {

        let product = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: this.dataset.price,
            img: this.dataset.img
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update ikon jumlah
        document.getElementById("cart-count").textContent = cart.length;
    });
});

// --- helper: generate filename variants (spaces, underscores, hyphens, lowercase, encoded) ---
function generateFilenameVariants(name){
	// return array of distinct candidate filenames (not full paths)
	if(!name) return [];
	const variants = new Set();
	const raw = name;
	variants.add(raw);

	// remove common prefixes/suffixes
	const noSpaces = raw.replace(/\s+/g,'');
	const under = raw.replace(/\s+/g,'_');
	const hyphen = raw.replace(/\s+/g,'-');
	variants.add(noSpaces);
	variants.add(under);
	variants.add(hyphen);

	// lowercase
	variants.add(raw.toLowerCase());
	variants.add(noSpaces.toLowerCase());
	variants.add(under.toLowerCase());
	variants.add(hyphen.toLowerCase());

	// encoded
	variants.add(encodeURIComponent(raw));
	variants.add(encodeURIComponent(under));
	variants.add(encodeURIComponent(hyphen));
	variants.add(encodeURIComponent(noSpaces));

	// also try removing special chars (keep extension)
	const m = raw.match(/^(.+?)(\.[^.]+)?$/);
	if(m){
		const base = m[1].replace(/[^a-zA-Z0-9]/g,'');
		const ext = m[2] || '';
		if(base) variants.add(base + ext);
		if(base) variants.add(base.toLowerCase() + ext);
	}

	return Array.from(variants).filter(Boolean);
}

// --- make candidates combining folders and filename variants ---
function buildCandidates(filename, folderList){
	const fileVariants = generateFilenameVariants(filename);
	const candidates = [];
	(folderList||[]).forEach(folder => {
		fileVariants.forEach(fv => {
			candidates.push(folder + fv);
		});
	});
	// also try top-level img/ and raw filenames
	fileVariants.forEach(fv => {
		candidates.push('img/' + fv);
		candidates.push(fv);
	});
	// fallback inline SVG
	candidates.push('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">' +
		'<rect width="100%" height="100%" fill="#eef2f5"/>' +
		'<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6c757d" font-size="24">No Image</text>' +
		'</svg>'
	));
	// unique preserve order
	return Array.from(new Set(candidates));
}

// --- Salep: build using generate variants + folders ---
(function(){
	// filenames based on your list (extensions must match actual files)
	const salepFiles = [
		{ name:'Gentamicin', file:'1_Gentamicin.png' },
		{ name:'Erythromycin', file:'2_Erythromycin.png' },
		{ name:'Diclofenac Sodium', file:'3_Diclofenac Sodium.png' },
		{ name:'Hydrocortisone', file:'4_Hidrocortison.png' },
		{ name:'Mupirocin', file:'5_Mupirocin.png' },
		{ name:'Clotrimazole', file:'6_Cloritromazol.png' },
		{ name:'Fusidic acid', file:'7_Fusidic acid.png' },
		{ name:'Ketoprofen', file:'8_Ketoprofen.png' },
		{ name:'Miconazole', file:'9_Miconazole.png' },
		{ name:'Betamethasone', file:'10_Bethametasone.png' },
		{ name:'Neomycin', file:'11_Neomycin.png' },
		{ name:'Bacitracin', file:'12_Bacitracin.png' },
		{ name:'Clobetasol Propionate', file:'13_Clobetasol.png' },
		{ name:'Ketoconazole', file:'14_Ketoconazole.png' },
		{ name:'Terbinafine', file:'15_Terbinafine.png' },
		{ name:'Sulfur', file:'16_Sulfur.png' },
		{ name:'Polymyxin B', file:'17_PolymyxinB.png' },
		{ name:'Chlorhexidine', file:'18_Chlorhexidine.png' },
		{ name:'Tretinoin', file:'19_Tretinoin.png' },
		{ name:'Pramoxine', file:'20_Pramoxine.png' },
		{ name:'Benzoyl Peroxide', file:'21_BenzoylPeroxide.png' },
		{ name:'Menthol', file:'22_Menthol.png' }
	];

	const salepFolders = [
		'img/Sale[/',           // user folder raw
		'img/Sale%5B/',         // encoded
		'img/Sale/',
	];

	window.salepData = salepFiles.map(f => ({
		name: f.name,
		candidates: buildCandidates(f.file, salepFolders),
		file: f.file
	}));
	console.info('salepData initialized (' + window.salepData.length + ' items).');
})();

// --- Sirup: build using generate variants + folders ---
(function(){
	const sirupFiles = [
		{ file:'1_PCT.png', name:'Paracetamol' },
		{ file:'2_Ibuprofen.png', name:'Ibuprofen' },
		{ file:'3_Sulfametoksazol.png', name:'Sulfametoksazol' },
		{ file:'4_Vitamin C.png', name:'Vitamin C' },
		{ file:'5_Cetirizine.png', name:'Cetirizine' },
		{ file:'6_Felmorata.png', name:'Felmorata' },
		{ file:'7_Felmorahist.png', name:'Felmorahist' },
		{ file:'8_Feldecon.png', name:'Feldecon' },
		{ file:'9_Felmed.png', name:'Felmed' },
		{ file:'10_Felcral.png', name:'Felcral' }
	];

	const sirupFolders = [
		'img/Sirup-20251209T022312Z-3-001/Sirup/',
		'img/Sirup-20251209T022312Z-3-001/',
		'img/Sirup/'
	];

	window.sirupData = sirupFiles.map(f => ({
		name: f.name,
		candidates: buildCandidates(f.file, sirupFolders),
		file: f.file
	}));
	console.info('sirupData initialized (' + window.sirupData.length + ' items).');
})();

// --- Enhanced debug: try candidates and report exactly which candidate succeeded or list tried ones ---
(function enhancedDebug(){
	function testCandidatesSequentially(candidates, cb){
		let i=0;
		function next(){
			if(i>=candidates.length) return cb(null, candidates);
			const url = candidates[i++];
			const img = new Image();
			img.onload = function(){ cb(url, candidates.slice(0,i)); };
			img.onerror = function(){ next(); };
			img.src = url;
		}
		next();
	}

	function logResultsForData(data, label){
		if(!data || !data.length) { console.info(label + ': no data'); return; }
		data.forEach((p, idx)=>{
			testCandidatesSequentially(p.candidates.slice(), function(found, tried){
				if(found){
					console.info(label + ' CHECK: OK ->', p.name, '=>', found);
					// apply to thumbnails if present
					try {
						document.querySelectorAll('.prod-thumb').forEach(img=>{
							const alt = (img.getAttribute('alt')||'').trim();
							if(alt && alt.toLowerCase()===p.name.toLowerCase()) { img.src = found; img.setAttribute('data-candidates', JSON.stringify(p.candidates)); }
							if(img.dataset.file && img.dataset.file===p.file){ img.src = found; img.setAttribute('data-candidates', JSON.stringify(p.candidates)); }
						});
					} catch(e){}
				} else {
					console.warn(label + ' CHECK: NONE for', p.name, 'tried:', tried.slice(0,20));
				}
			});
		});
	}

	// run checks after load
	window.addEventListener('load', function(){
		setTimeout(function(){
			logResultsForData(window.sirupData, 'SIRUP');
			logResultsForData(window.salepData, 'SALEP');
		}, 300);
	});
})();

// Fallback: pastikan spinner dihapus juga setelah window load (jika masih ada)
window.addEventListener('load', function(){
	try {
		setTimeout(function(){
			var s = document.getElementById('spinner');
			if(s){
				// remove from DOM so it can't block UI
				if(s.parentNode) s.parentNode.removeChild(s);
				else s.style.display = 'none';
			}
		}, 200); // short delay to allow other onload handlers
	} catch(e){ console.warn('Spinner fallback removal failed', e); }
});

// mark this file as the project main (used by pages to verify correct file is loaded)
try {
	window.projectMainLoaded = true;
	// log script src when possible to detect wrong origin (template vs project)
	(function(){
		var src = (document.currentScript && document.currentScript.src) || (function(){
			// fallback: find script element with id if page set it
			var s = document.getElementById('project-main');
			return s ? s.src : 'unknown';
		})();
		console.info('Project main.js executed. script src=', src);
	})();
} catch(e){ /* ignore */ }
