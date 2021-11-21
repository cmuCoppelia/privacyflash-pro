//
//  ImgurImage+Size.swift
//  Beam
//
//  Created by Rens Verhoeven on 28-04-16.
//  Copyright © 2016 Awkward. All rights reserved.
//

import UIKit
import ImgurKit

extension ImgurImage {
    
    func aspectRatioSizeWithMaxWidth(_ maxWidth: CGFloat, maxHeight: CGFloat? = nil) -> CGSize? {
        if let imageHeight = self.imageSize?.height, let imageWidth = self.imageSize?.width {
            let aspectRatioImageHeight = CGFloat(imageHeight) * maxWidth / CGFloat(imageWidth)
            var newHeight = aspectRatioImageHeight
            if let maxHeight = maxHeight {
                newHeight = min(aspectRatioImageHeight, maxHeight)
            }
            return CGSize(width: maxWidth, height: newHeight)
        }
        return nil
    }
    
    func viewControllerPreviewingSize() -> CGSize {
        if let mediaSize = self.aspectRatioSizeWithMaxWidth(UIScreen.main.bounds.size.width, maxHeight: UIScreen.main.bounds.size.height) {
            return mediaSize
        }
        return CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.width)
    }
}
