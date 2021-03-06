/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Compiler = require("../../../server/lib/recording-compiler.js").RecordingCompiler;

function getCompiler() {
    var c = Object.create(Compiler).init({enhanceCodeReadibility:false});
    c.clearActions();
    return c;
}

function makeOneLiner(code) {
    return code.replace(/\r\n\s+/g, "").replace(/\r\n/g, "").replace(/\t/g, "");
}

describe("Basic tests", function() {

    it("gotoUrl() only", function() {
        var c = getCompiler();
        c.pushNavigate('home.com');
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();agent.gotoUrl("home.com");');
    });

    it("mousemove()", function() {
        var c = getCompiler();
        c.pushEvent({target:1, timeStamp:1, type:'mousemove', arguments:{} });
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();agent.element("1").mouseMove(,);');
    });
});

describe("Known events tests", function() {
    // Test some known event types that code is genreated properly for them.

    it("keypress()", function() {
        var c = getCompiler();
        c.pushEvent({target:1, timeStamp:1, type:'keypress', arguments:{} });
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();agent.element("1").sendKeys(" ");');
    });

    it("keypress() with params", function() {
        var c = getCompiler();
        c.pushEvent({target:1, timeStamp:1, type:'keypress', arguments:{keyCode:7, which:7} });
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();agent.element("1").sendKeys("");');
    });
});


describe("Unknown events tests", function() {
    // Test some known event types that code is genreated properly for them.

    it("whatever() should be generated via dispatchEvent()", function() {
        var c = getCompiler();
        c.pushEvent({target:1, timeStamp:1, type:'whatever', arguments:{} });
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();// agent.element("1").dispatchEvent("whatever");');
    });

    it("whatever(with params) should be generated via dispatchEvent(with params)", function() {
        var c = getCompiler();
        c.pushEvent({target:1, timeStamp:1, type:'whatever', arguments:{param1:1, param2: "two"} });
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();// agent.element("1").dispatchEvent("whatever",{"param1":1,"param2":"two"});');
    });
});


describe("Other tests", function() {
    // Test some known event types that code is genreated properly for them.

    it("setScroll", function() {
        var c = getCompiler();
        c.pushEvent({target:1, timeStamp:1, type:'scroll', arguments:{scrollLeft:1, scrollTop:2} });
        expect(makeOneLiner(c.compile())).toEqual('var agent = new Agent();agent.element("1").setScroll(1,2);');
    });
});
