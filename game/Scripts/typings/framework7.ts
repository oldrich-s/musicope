interface Framework7Callback {
    remove: () => void;
    trigger: () => void;
}

declare class Framework7 {
    constructor(options);
    addView(name, options);
    searchbar(name, options);
    public static $;
    init(): void;
    addNotification(params): void;
    confirm(question: string, title: string, okFn: () => void): void;
    prompt(question: string, title: string, okFn: (response: string) => void): void;
    alert(question: string, title: string, okFn?: (response: string) => void): void;
    closeNotification(notificationElement): void;
    photoBrowser(params): any;
    popover(show, where): void;
    onPageInit(pageName: string, fn: (page: any) => void): void;
    onPageBeforeRemove(pageName: string, fn: (page: any) => void): void;
    onPageAfterAnimation(pageName: string, fn: (page: any) => void): Framework7Callback;
    onPageBeforeAnimation(pageName: string, fn: (page: any) => void): Framework7Callback;
    sizeNavbars(): void;
    slider(container: string, options): any;
};

declare class Template7 {
    static compile(template: string): (context: any) => string;
}

interface KnockoutStatic {
    watch: (targetObjectOrFunction, options, evaluatorCallback) => void;
}
 