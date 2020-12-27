(function handleArticle() {

    const $postContentBody = document.querySelector('#post-content-body');
    selectParagraphHandler($postContentBody, handleParagraph, handleParagraph_ifP);
    handleCodeBlocks($postContentBody);
    handleH3Tags($postContentBody);

    addClickHandlers();

    function selectParagraphHandler($postContentBody, handleParagraph, handleParagraph_ifP) {

        if(detectionTagsP($postContentBody)) {
            handleParagraph_ifP($postContentBody)
        } else {
            handleParagraph($postContentBody);
        }


        function detectionTagsP($postContentBody) {
            const allTagsP = $postContentBody.getElementsByTagName('P');
            if (allTagsP.length > 2) return true;
            return false;
        }
    }

    function addClickHandlers() {
        document.addEventListener("click", ({target}) => {

            if(target.id === "copy_p") {
                return handleBtnCopyP(target);
            }

            if(target.id === "copy_code") {
                return handleBtnCopyCode(target);
            }

            if(target.id === "copy_h3") {
                return handleBtnCopyH3Text(target);
            }

            if(target.id === "copy_p_ifP") {
                return handleBtnCopyP_ifP(target);
            }

        })
    }

    function handleParagraph($postContentBody) {
        const allTagsBR = [...$postContentBody.getElementsByTagName("BR")];
        const allTargetTagsBR = allTagsBR.filter(br => br.nextSibling.nodeValue === "\n" && detectionNextElementBR(br) );

        if(allTargetTagsBR.length === 0) {
            console.warn ( "allTargetTagsBR === 0" );
        }

        allTargetTagsBR.forEach( br => addButtonCopyText(br));

        function addButtonCopyText(br) {
            const btn = createBtnParagraphTextCopy();
            br.parentNode.insertBefore(btn, br.nextElementSibling)
        }

        function createBtnParagraphTextCopy() {
            const btn = document.createElement("Button");
            btn.innerHTML = "Copy_P";
            btn.id = "copy_p";

            return btn;

        }

        function detectionNextElementBR(br) {
            return br.nextSibling.nextSibling && br.nextSibling.nextSibling.tagName && br.nextSibling.nextSibling.tagName === "BR"
        }
    }

    function handleParagraph_ifP($postContentBody) {
        const allTagsP = $postContentBody.querySelectorAll('P');
        allTagsP.forEach( $p => addButtonCopyText($p));

        function addButtonCopyText($p) {
            const btn = createBtnParagraphTextCopy();
            $p.parentNode.insertBefore(btn, $p.nextElementSibling)
        }

        function createBtnParagraphTextCopy() {
            const btn = document.createElement("Button");
            btn.innerHTML = "Copy_P";
            btn.id = "copy_p_ifP";

            return btn;

        }
    }

    function handleCodeBlocks($postContentBody) {

        const allCodeBlocks = $postContentBody.getElementsByTagName("PRE");

        if(allCodeBlocks.length === 0) return;

        Array.prototype.forEach.call(allCodeBlocks, $code => addButtonCodeCopy($code));


        function addButtonCodeCopy ($code) {
            const btn = createBtnCodeCopy();
            $code.parentNode.insertBefore(btn, $code.nextSibling);

            function createBtnCodeCopy(){
                const btn = document.createElement("Button");
                btn.innerHTML = "CopyCode";
                btn.id = "copy_code";
                return btn;
            }
        }
    }

    function handleH3Tags($postContentBody) {
        const allH3Tags = $postContentBody.getElementsByTagName("H3");

        if(allH3Tags.length === 0) return;

        Array.prototype.forEach.call(allH3Tags, $h3 => addButtonCopyH3($h3));

        function addButtonCopyH3($h3) {
            const btn = createBtnCopyH3();
            $h3.parentNode.insertBefore(btn, $h3.nextSibling);

            function createBtnCopyH3() {
                const btn = document.createElement("Button");
                btn.innerHTML = "CopyH3";
                btn.id = "copy_h3";
                return btn;
            }
        }
    }

    function handleBtnCopyP(target) {

        const elems = findTextArea(target);
        const paragraphText = createText(elems);

        function findTextArea(target) {

            const elems = {
                start: undefined,
                end: undefined
            };

            elems.end = target.previousElementSibling;

            let previous = target.previousElementSibling.previousSibling;

            while(previous.nodeName !== "BR") {
                previous = previous.previousElementSibling
            }

            elems.start = previous;

            return elems;
        }

        function createText(elems) {

            const { start, end } = elems;

            let text = "";
            let next = start;
            let elementCount = 0;

            while(next !== end && elementCount < 10){
                next = next.nextSibling;


                if(next.textContent) {
                    text = text + next.textContent
                }
                elementCount++
            }

            return text + "\n\n";
        }

        navigator.clipboard.writeText(paragraphText)
            .then(() => {
                target.style.border = "1px solid green";
            })
            .catch(err => {
                alert('Copy failed');
            });
    }

    function handleBtnCopyP_ifP(target) {
        const $targetP = target.previousElementSibling;
        const paragraphText = $targetP.textContent + "\n\n";

        navigator.clipboard.writeText(paragraphText)
            .then(() => {
                target.style.border = "1px solid green";
            })
            .catch(err => {
                alert('Copy failed');
            });
    }

    function handleBtnCopyCode(target) {
        const $tagPRE = target.previousElementSibling;
        const codeText = $tagPRE.firstElementChild.textContent + "\n\n";

        navigator.clipboard.writeText(codeText)
            .then(() => {
                $tagPRE.style.border = "1px solid green";
                target.style.border = "1px solid green";
            })
            .catch(err => {
                alert('Copy failed');
            });
    }

    function handleBtnCopyH3Text(target) {
        const text = target.previousElementSibling.textContent + "\n\n";

        navigator.clipboard.writeText(text)
            .then(() => {
                target.style.border = "1px solid green";
            })
            .catch(err => {
                alert('Copy failed');
            });
    }

})();