package fourth

import java.awt.Point
import java.awt.geom.Point2D
import kotlin.math.roundToInt
import kotlin.math.sqrt

class Coordinate(x: Double, y: Double, z: Double) {
    val xx = (y - x) * sqrt(3.0) / 2.0
    val yy = (x + y) / 2 - z

    fun getNormalizedPoint(minV: Point2D.Double, maxV: Point2D.Double, width: Int, height: Int) =
        Point(((xx - minV.x) / (maxV.x - minV.x) * width).roundToInt(),
            ((yy - minV.y) / (maxV.y - minV.y) * height).roundToInt())
}