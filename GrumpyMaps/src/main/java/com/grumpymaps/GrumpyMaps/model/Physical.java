package com.grumpymaps.GrumpyMaps.model;

import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

public interface Physical {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="square_id")
    public Square square=null;
}
