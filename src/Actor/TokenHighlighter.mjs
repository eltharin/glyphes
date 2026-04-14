

export class TokenHighlighter {
    static tokens = [];

    static addHighlight(token, options = {}) 
    {
        if (token.children.find(c => c.name === 'speaker-highlight-ring')) return;

        const color = options.color ? parseInt(options.color.replace('#', ''), 16) : 0xFFD700;
        const sizeFactor = options.sizeFactor || 1.1;

        const ring = new PIXI.Container();
        ring.name = 'speaker-highlight-ring';

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(6, color, 0.8);
        
        const radius = (Math.max(token.w, token.h) / 2) * sizeFactor;
        graphics.drawCircle(token.w / 2, token.h / 2, radius);

        const BlurFilter = PIXI.BlurFilter || PIXI.filters.BlurFilter;
        const blurFilter = new BlurFilter();
        blurFilter.blur = 4;
        blurFilter.quality = 3;
        graphics.filters = [blurFilter];

        ring.addChild(graphics);
        
        const innerRing = new PIXI.Graphics();
        innerRing.lineStyle(2, 0xFFFFFF, 1.0);
        innerRing.drawCircle(token.w / 2, token.h / 2, radius);
        ring.addChild(innerRing);

        token.addChild(ring);
        TokenHighlighter.tokens.push(token);
    }

    static removeAllHighlights(options = {}) 
    {
        TokenHighlighter.tokens.forEach(t => TokenHighlighter.removeHighlight(t, options));
        TokenHighlighter.tokens = [];
    }
     
    static removeHighlight(token, options = {}) 
    {
        const ring = token.children.find(c => c.name === 'speaker-highlight-ring');
        if (ring) {
            token.removeChild(ring);
            ring.destroy({children: true});
        }
    }
}