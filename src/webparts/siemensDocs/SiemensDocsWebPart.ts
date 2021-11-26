import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDom from "react-dom";
import * as strings from "SiemensDocsWebPartStrings";
import SiemensDocs, { ISiemensDocsProps } from "./components/SiemensDocs";

export interface ISiemensDocsWebPartProps {
  editorMode: boolean,
  saveFolder: string,
}

export default class SiemensDocsWebPart extends BaseClientSideWebPart<ISiemensDocsWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ISiemensDocsProps> = React.createElement(
      SiemensDocs,
      { editorMode: this.properties.editorMode, spContext: this.context, filePath: this.properties.saveFolder || "" }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("saveFolder", {
                  label: strings.PropertyPaneSaveFolder,
                }),
                PropertyPaneToggle("editorMode", {
                  label: strings.PropertyPaneEditorModeLable,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
